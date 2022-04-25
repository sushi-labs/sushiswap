import { Furo } from './Furo'
import { StreamRepresentation } from './representations'

export class Stream extends Furo {
  public constructor({ stream }: { stream: StreamRepresentation }) {
    super({ furo: stream })
  }
}
