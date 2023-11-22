import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { RoleEnum } from '../role/role.enum';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/services/user.service';
import { EntityManager } from 'typeorm';
import { Transaction } from '../transaction/transaction.entity';
import { Order } from '../order/order.entity';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { CancelPaymentDto } from './dto/cancel-payment.dto';
import { PaymentOrderStatus, PaymentResponseCode } from './payment.enum';
import {
  TransactionStatus,
  TransactionType,
} from '../transaction/transaction.enum';
import { Forbidden } from '../../errors/Forbidden';
import { OrderStatus } from '../order/order.enum';
import { BadRequest } from '../../errors/BadRequest';
import { OrderService } from '../order/order.service';
import { RetryPaymentDto } from './dto/retry-payment.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { User } from '../user/entities/user.entity';
import { ParamUUID } from '../../decorators/ParamUUID';

@ApiBearerAuth()
@ApiTags('Payment')
@UseGuards(JwtAccessGuard, RoleGuard)
@Controller({
  path: 'payment',
})
export class PaymentController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly transactionService: TransactionService,
    private readonly entityManager: EntityManager,
  ) {}

  @Get(':id')
  @Roles(RoleEnum.CLIENT, RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getPaymentDetails(@ParamUUID('id') paymentId: string) {
    return this.paymentService.getPaymentDetails(paymentId);
  }

  // @Post('init')
  // @Roles(RoleEnum.CLIENT)
  // @HttpCode(HttpStatus.CREATED)
  // async initPayment(
  //   @Request() { user }: { user: User },
  //   @Body() initPaymentDto: InitPaymentDto,
  // ) {
  //   const { flowStateId, price } = initPaymentDto;
  //
  //   const flowState = await this.flowStateService.getFlowStateWithUser(
  //     flowStateId,
  //   );
  //   if (!flowState) {
  //     throw new NotFound('flow_state_not_found');
  //   }
  //   if (flowState.user.id !== user.id) {
  //     throw new Forbidden('flow_state_no_access');
  //   }
  //
  //   const incompleteOrder = flowState.orders.find(
  //     (order: Order) =>
  //       order.status === OrderStatus.PENDING &&
  //       order.transactions[0]?.paymentId,
  //   );
  //
  //   if (incompleteOrder) {
  //     const paymentId = incompleteOrder?.transactions[0]?.paymentId;
  //
  //     const paymentUrl = this.configService.get<string>('payment.paymentUrl');
  //     const language = PaymentLanguage.RUSSIAN;
  //
  //     const url = `${paymentUrl}?id=${paymentId}&lang=${language}`;
  //     return { url, orderId: incompleteOrder.id };
  //   }
  //
  //   let transaction: Transaction;
  //   let order: Order;
  //   const providerOrderId =
  //     await this.transactionService.generateProviderOrderId();
  //
  //   await this.entityManager.transaction(async (transactionalEntityManager) => {
  //     // creating initial order and transaction before payment init
  //     transaction = transactionalEntityManager.create(Transaction, {
  //       status: TransactionStatus.PENDING,
  //       type: TransactionType.INIT,
  //       providerOrderId,
  //       amount: price,
  //       user,
  //     });
  //     await transactionalEntityManager.save(Transaction, transaction);
  //
  //     order = transactionalEntityManager.create(Order, {
  //       status: OrderStatus.PENDING,
  //       price,
  //       user,
  //       transactions: [transaction],
  //       flowState,
  //     });
  //     await transactionalEntityManager.save(Order, order);
  //   });
  //
  //   const initPaymentResponse = await this.paymentService.initPayment({
  //     OrderID: providerOrderId,
  //     Amount: price,
  //   });
  //
  //   const url = await this.paymentService.handlePaymentInit(
  //     initPaymentResponse,
  //     order,
  //     transaction,
  //   );
  //   if (!url) {
  //     return {
  //       orderId: order.id,
  //       message: 'Payment Failed, please retry.',
  //     };
  //   }
  //
  //   return { url, orderId: order.id };
  // }

  @Post('retry')
  @Roles(RoleEnum.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  async retryPayment(
    @Request() { user }: { user: User },
    @Body() retryPaymentDto: RetryPaymentDto,
  ) {
    const { orderId, price } = retryPaymentDto;
    let order = await this.orderService.getOrder(orderId);
    if (!order) {
      throw new BadRequest('order_not_found');
    }
    if (order.user?.id !== user.id) {
      throw new Forbidden('order_no_access');
    }
    if (order.status !== OrderStatus.FAILED) {
      throw new BadRequest('retry_only_when_failed');
    }
    const providerOrderId =
      await this.transactionService.generateProviderOrderId();

    let transaction: Transaction;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // creating initial order and transaction before payment init
      transaction = transactionalEntityManager.create(Transaction, {
        status: TransactionStatus.PENDING,
        type: TransactionType.RETRY,
        providerOrderId,
        amount: price,
        user,
      });
      await transactionalEntityManager.save(Transaction, transaction);

      order = await transactionalEntityManager.save(Order, {
        ...order,
        status: OrderStatus.PENDING,
        transactions: [...order.transactions, transaction],
      });
    });

    const initPaymentResponse = await this.paymentService.initPayment({
      OrderID: providerOrderId,
      Amount: price,
    });

    const url = await this.paymentService.handlePaymentInit(
      initPaymentResponse,
      order,
      transaction,
    );
    if (!url) {
      throw new BadRequest('payment_failed');
    }

    return { url, orderId: order.id };
  }

  @Put('refund')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async refundPayment(
    @Request() { user }: { user: User },
    @Body() refundPaymentDto: RefundPaymentDto,
  ) {
    const { orderId, amount } = refundPaymentDto;

    let order = await this.orderService.getOrder(orderId);
    if (!order) {
      throw new BadRequest('order_not_found');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new Forbidden('order_no_access');
    }

    const { paymentId, providerOrderId } = order.transactions[0];

    let transaction: Transaction;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      transaction = transactionalEntityManager.create(Transaction, {
        status: TransactionStatus.PENDING,
        type: TransactionType.REFUND, //tarber
        amount, // tarber
        paymentId,
        providerOrderId,
        user,
      });
      await transactionalEntityManager.save(Transaction, transaction);

      order = await transactionalEntityManager.save(Order, {
        ...order,
        transactions: [...order.transactions, transaction],
      });
    });

    const refundPaymentResponse = await this.paymentService.refundPayment({
      PaymentId: paymentId,
      Amount: amount,
    });

    const { ResponseCode } = refundPaymentResponse;
    if (ResponseCode !== PaymentResponseCode.APPROVED) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Transaction, {
            ...transaction,
            status: TransactionStatus.FAILED,
            details: refundPaymentResponse,
          });

          await transactionalEntityManager.save(Order, {
            ...order,
            status: OrderStatus.FAILED,
          });
        },
      );

      throw new BadRequest('payment_refund_failed'); // taber
    }

    const paymentDetails = await this.paymentService.getPaymentDetails(
      paymentId,
    );

    if (
      paymentDetails.OrderStatus !== PaymentOrderStatus.PAYMENT_REFUNDED //tarber
    ) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Transaction, {
            ...transaction,
            status: TransactionStatus.FAILED,
            details: paymentDetails,
          });

          await transactionalEntityManager.save(Order, {
            ...order,
            status: OrderStatus.FAILED,
          });
        },
      );

      throw new BadRequest('payment_refund_failed'); //tarber
    }

    let orderStatus: OrderStatus;
    if (paymentDetails.Amount - paymentDetails.RefundedAmount > 0) {
      orderStatus = OrderStatus.PARTIAL_REFUNDED;
    } else {
      orderStatus = OrderStatus.REFUNDED;
    }
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(Transaction, {
        ...transaction,
        status: TransactionStatus.COMPLETED,
        details: paymentDetails,
      });

      await transactionalEntityManager.save(Order, {
        ...order,
        status: orderStatus,
      });
    });

    return { orderId: order.id };
  }

  @Post('cancel')
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async cancelPayment(
    @Request() { user }: { user: User },
    @Body() cancelPaymentDto: CancelPaymentDto,
  ) {
    const { orderId } = cancelPaymentDto;

    let order = await this.orderService.getOrder(orderId);
    if (!order) {
      throw new BadRequest('order_not_found');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new Forbidden('order_no_access');
    }

    const { paymentId, providerOrderId } = order.transactions[0];

    let transaction: Transaction;
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      transaction = transactionalEntityManager.create(Transaction, {
        status: TransactionStatus.PENDING,
        type: TransactionType.CANCEL,
        paymentId,
        providerOrderId,
        user,
      });
      await transactionalEntityManager.save(Transaction, transaction);

      order = await transactionalEntityManager.save(Order, {
        ...order,
        transactions: [...order.transactions, transaction],
      });
    });

    const cancelPaymentResponse = await this.paymentService.cancelPayment({
      PaymentId: paymentId,
    });

    const { ResponseCode } = cancelPaymentResponse;
    if (ResponseCode !== PaymentResponseCode.APPROVED) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Transaction, {
            ...transaction,
            status: TransactionStatus.FAILED,
            details: cancelPaymentResponse,
          });

          await transactionalEntityManager.save(Order, {
            ...order,
            status: OrderStatus.FAILED,
          });
        },
      );

      throw new BadRequest('payment_cancel_failed');
    }

    const paymentDetails = await this.paymentService.getPaymentDetails(
      paymentId,
    );

    if (paymentDetails.OrderStatus !== PaymentOrderStatus.PAYMENT_VOID) {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.save(Transaction, {
            ...transaction,
            status: TransactionStatus.FAILED,
            details: paymentDetails,
          });

          await transactionalEntityManager.save(Order, {
            ...order,
            status: OrderStatus.FAILED,
          });
        },
      );

      throw new BadRequest('payment_cancel_failed');
    }

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(Transaction, {
        ...transaction,
        status: TransactionStatus.COMPLETED,
        details: paymentDetails,
      });

      await transactionalEntityManager.save(Order, {
        ...order,
        status: OrderStatus.CANCELLED,
      });
    });

    return { orderId: order.id };
  }
}
