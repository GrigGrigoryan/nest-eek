import { Injectable, Logger } from '@nestjs/common';
import {
  InitPaymentRequestDto,
  InitPaymentResponseDto,
} from './dto/init-payment.dto';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import {
  RefundPaymentRequestDto,
  RefundPaymentResponseDto,
} from './dto/refund-payment.dto';
import {
  CancelPaymentRequestDto,
  CancelPaymentResponseDto,
} from './dto/cancel-payment.dto';
import { InternalServerError } from '../../errors/InternalServerError';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionStatus } from '../transaction/transaction.enum';
import { Order } from '../order/order.entity';
import { OrderStatus } from '../order/order.enum';
import { PaymentLanguage } from './payment.enum';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentService {
  private readonly logger: Logger = new Logger(PaymentService.name);
  private readonly username: string;
  private readonly password: string;
  private readonly clientId: string;
  private readonly apiUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {
    this.username = this.configService.get<string>('payment.username');
    this.password = this.configService.get<string>('payment.password');
    this.clientId = this.configService.get<string>('payment.clientId');
    this.apiUrl = this.configService.get<string>('payment.apiUrl');
  }

  async initPayment(
    initPaymentRequestDto: InitPaymentRequestDto,
  ): Promise<InitPaymentResponseDto> {
    const { OrderID, Amount } = initPaymentRequestDto;

    const frontendDomain = this.configService.get<string>('app.frontendDomain');
    const BackURL = `${frontendDomain}/payment-success?orderId=${OrderID}`;
    const Currency = 'AMD';
    const Timeout = 1200; //seconds
    const Description = `Payment success. Amount: ${Amount} ${Currency}`;

    try {
      const response = await axios.post(`${this.apiUrl}/InitPayment`, {
        ClientID: this.clientId,
        Amount,
        OrderID,
        BackURL,
        Username: this.username,
        Password: this.password,
        Description,
        Currency,
        Timeout,
      });

      this.logger.debug(`Payment Init: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerError('payment_init_error');
    }
  }

  async handlePaymentInit(
    initPaymentResponseDto: InitPaymentResponseDto,
    order: Order,
    transaction: Transaction,
  ): Promise<string> {
    const { PaymentID, ResponseCode } = initPaymentResponseDto;

    await this.entityManager.transaction(async (transactionalEntityManager) => {
      if (ResponseCode !== 1) {
        // when error happens and payment id not granted
        // statuses to be failed
        await transactionalEntityManager.save(Transaction, {
          ...transaction,
          status: TransactionStatus.FAILED,
          details: initPaymentResponseDto,
        });
        await transactionalEntityManager.save(Order, {
          ...order,
          status: OrderStatus.FAILED,
        });
      } else {
        await transactionalEntityManager.save(Transaction, {
          ...transaction,
          paymentId: PaymentID,
        });
      }
    });

    if (!PaymentID) {
      return;
    }

    const paymentUrl = this.configService.get<string>('payment.paymentUrl');
    const language = PaymentLanguage.RUSSIAN;

    return `${paymentUrl}?id=${PaymentID}&lang=${language}`;
  }

  async getPaymentDetails(PaymentId: string) {
    try {
      const response = await axios.post(`${this.apiUrl}/GetPaymentDetails`, {
        PaymentId,
        Username: this.username,
        Password: this.password,
      });

      this.logger.debug(`Payment Details: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerError('payment_details_error');
    }
  }

  async cancelPayment(
    cancelPaymentRequestDto: CancelPaymentRequestDto,
  ): Promise<CancelPaymentResponseDto> {
    const { PaymentId } = cancelPaymentRequestDto;

    try {
      const response: AxiosResponse<CancelPaymentResponseDto> =
        await axios.post(`${this.apiUrl}/CancelPayment`, {
          PaymentId,
          Username: this.username,
          Password: this.password,
        });

      this.logger.debug(`Payment Cancel: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerError('payment_cancel_error');
    }
  }

  async refundPayment(
    refundPaymentRequestDto: RefundPaymentRequestDto,
  ): Promise<RefundPaymentResponseDto> {
    const { PaymentId, Amount } = refundPaymentRequestDto;

    try {
      const response: AxiosResponse<RefundPaymentResponseDto> =
        await axios.post(`${this.apiUrl}/RefundPayment`, {
          PaymentId,
          Amount,
          Username: this.username,
          Password: this.password,
        });

      this.logger.debug(`Payment Refund: ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerError('payment_refund_error');
    }
  }
}
