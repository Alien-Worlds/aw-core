export type FakeDocument = {
    _id?: string,
    data?: string,
}

export class FakeEntity {
  private constructor(
    public readonly id: string,
    public readonly data: string,
  ) {}

  public toDocument(): FakeDocument {
    const {
      id, data
    } = this;

    const document = {
      _id: id,
      data,
    }

    return document;
  }

  public static fromDocument(dto: FakeDocument): FakeEntity {
    const {
      _id,
      data,
    } = dto;

    return new FakeEntity(
      _id,
      data,
    );
  }

  public static create(
    id: string,
    data: string
  ): FakeEntity {

    return new FakeEntity(
      id,
      data
    );
  }
}
