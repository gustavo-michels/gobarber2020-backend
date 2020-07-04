import ISendMailProviderDTO from '../dtos/ISendMailProviderDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailProviderDTO): Promise<void>;
}
