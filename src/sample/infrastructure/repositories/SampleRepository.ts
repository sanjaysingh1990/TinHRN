
import { injectable } from "tsyringe";
import { ISampleRepository } from "../../domain/repositories/ISampleRepository";

@injectable()
export class SampleRepository implements ISampleRepository {
  async getSampleData(): Promise<string> {
    // In a real app, you'd fetch this from an API or local storage
    return "Hello from Clean Architecture!";
  }
}
