import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { randomUUID } from 'crypto';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
    cors: true, 
  });
  const PORT = process.env.PORT
 || 3006;

  try {
    await app.listen(PORT);
    console.log(`✅ App is running on http://localhost:${PORT}`);

  } catch (err) {
    console.error(`❌ Failed to bind to port ${PORT}:`, err.message);
  }
}
bootstrap();
