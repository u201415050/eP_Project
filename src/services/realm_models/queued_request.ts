import realm from '../realm_service';
import { epaisaRequest } from '../epaisa_service';
interface QueuedRequestInterface {
  completed: boolean;
  parameters: string;
  endpoint: string;
  method: string;
  created_at: Date;
  attempts: number;
  errors: string[];
  key: string;
  extra: string;
  response: string[];
}
export default class QueuedRequest implements QueuedRequestInterface {
  completed: boolean;
  parameters: string;
  endpoint: string;
  method: string;
  created_at: Date;
  attempts: number;
  errors: string[];
  key: string;
  extra: string;
  response: string[];
  static schema = {
    name: 'QueuedRequest',
    properties: {
      completed: { type: 'bool', default: false },
      parameters: { type: 'string', default: '' },
      endpoint: 'string',
      method: 'string',
      created_at: 'date?',
      attempts: { type: 'int', default: 0 },
      errors: { type: 'string[]', default: [] },
      key: { type: 'string', default: '' },
      extra: { type: 'string', default: '' },
      response: { type: 'string[]', default: [] },
    },
  };

  static create(parameters: string, endpoint: string, method: string) {
    realm.write(() => {
      realm.create(this.schema.name, {
        parameters,
        endpoint,
        method,
      });
    });
  }
  static getUnsync() {
    return realm.objects(this.schema.name).filtered(`completed = false`);
  }
  async execute() {
    if (this.completed) {
      return;
    }
    const attempts = this.attempts + 1;
    let completed = false;
    let errorMessage;
    let res;
    try {
      realm.write(() => {
        this.completed = true;
      });
      res = await epaisaRequest(
        JSON.parse(this.parameters),
        this.endpoint,
        this.method,
        this.extra
      );
      if (res.success) {
        completed = true;
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      errorMessage = error.message;
    }
    realm.write(() => {
      this.attempts = attempts;
      this.completed = completed;
      if (errorMessage) {
        this.errors.push(errorMessage);
      }
      if (res) {
        this.response.push(JSON.stringify(res));
      }
    });
    return res;
  }
}
