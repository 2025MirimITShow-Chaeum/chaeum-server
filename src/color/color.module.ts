import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { ColorService } from './color.service';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorService],
  exports: [TypeOrmModule, ColorService],
})
export class ColorModule {}
