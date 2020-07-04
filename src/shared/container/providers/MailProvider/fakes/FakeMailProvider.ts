import IMailProvider from '../models/IMailProvider';
import ISendMailProviderDTO from '../dtos/ISendMailProviderDTO';

class FakeMailProvider implements IMailProvider {
  private messages: ISendMailProviderDTO[] = [];

  public async sendMail(message: ISendMailProviderDTO): Promise<void> {
    this.messages.push(message);
  }
}

export default FakeMailProvider;
