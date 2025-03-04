export class SlipGeneratedEvent {
  constructor(
    public readonly externalId: string,
    public readonly status: 'GENERATED' | 'ERROR',
    public readonly reason?: string, 
  ) {}
}