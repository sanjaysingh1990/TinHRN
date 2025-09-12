
import { inject, injectable } from "tsyringe";
import { UseCase } from "../../../core/application/UseCase";
import { ISampleRepository } from "../../domain/repositories/ISampleRepository";
import { SampleRepositoryToken } from "../../tokens";

@injectable()
export class GetSampleDataUseCase implements UseCase<void, Promise<string>> {
  constructor(
    @inject(SampleRepositoryToken) private sampleRepository: ISampleRepository
  ) {}

  execute(): Promise<string> {
    return this.sampleRepository.getSampleData();
  }
}
