import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as figlet from 'figlet';
import * as bodyParser from 'body-parser';
import { LoadEnvironmentVariables } from './config/utils/env';

async function bootstrap(): Promise<void> {
  LoadEnvironmentVariables();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['*'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-device'],
    methods: ['*'],
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT!);

  figlet('2025 - Hibly', (err, data) => {
    if (err || !data) {
      console.error('Erreur figlet :', err);
      return;
    }
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', data);

    figlet('Powered By VICTORY', { font: 'Small' }, (fontErr, res) => {
      if (fontErr || !res) {
        console.error('Erreur figlet (footer) :', fontErr);
        return;
      }
      console.log('\x1b[35m%s\x1b[0m', res);
    });
  });
}

void bootstrap();
