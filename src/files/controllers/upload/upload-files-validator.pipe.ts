import {
  Injectable,
  PipeTransform,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as mime from 'mime-types';

const allowedFileTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
];

const allowedDataTypes = ['date', 'number', 'string'];

@Injectable()
export class UploadFilesValidator implements PipeTransform<any> {
  async transform(value: any) {
    if (value && value.originalname) {
      const type = mime.lookup(value.originalname) as string;
      console.log(type);
      if (!allowedFileTypes.includes(type)) {
        throw new UnprocessableEntityException(
          'El archivo subido no es un archivo Excel',
        );
      }
      return value;
    } else if (value && value.format) {
      let format;
      let error;
      try {
        format = JSON.parse(value.format);
      } catch {
        throw new BadRequestException(
          `format should be a string with JSON format`,
        );
      }
      for (const prop of Object.keys(format)) {
        if (typeof format[prop] !== 'object') {
          error = `Property '${prop}' must be an object`;
        } else if (!format[prop].hasOwnProperty('name')) {
          error = `'${prop}' does not have 'name' property`;
        } else if (typeof format[prop].name !== 'string') {
          error = `Property 'name' in '${prop}' should be a string`;
        } else if (!format[prop].hasOwnProperty('type')) {
          error = `'${prop}' does not have 'type' property`;
        } else if (typeof format[prop].type !== 'string') {
          error = `Property 'type' in '${prop}' should be a string`;
        } else if (!allowedDataTypes.includes(format[prop].type)) {
          error = `Invalid type in format. Supported types: ${allowedDataTypes.toString()}`;
        }
        if (error) {
          throw new BadRequestException(error);
        }
      }
      value.format = format;
      return value;
    } else {
      throw new BadRequestException(`Pleae provide file and format`);
    }
  }
}
