export default interface IStorageProvider {
  safeFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
