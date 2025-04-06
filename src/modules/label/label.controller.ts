import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Label } from './entities/label.entity';

@Controller('label')
@ApiTags('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  @ApiOperation({ summary: '创建新标签' })
  @ApiResponse({ 
    status: 201, 
    description: '标签创建成功',
    type: Label 
  })
  createLabel(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  @ApiResponse({ 
    status: 200, 
    description: '返回所有标签列表',
    type: [Label]
  })
  findAllLabels() {
    return this.labelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取标签' })
  @ApiResponse({ 
    status: 200, 
    description: '返回指定标签',
    type: Label 
  })
  findOneLabel(@Param('id') id: string) {
    return this.labelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新标签' })
  @ApiResponse({ 
    status: 200, 
    description: '标签更新成功',
    type: Label 
  })
  updateLabel(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelService.update(id, updateLabelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签' })
  @ApiResponse({ 
    status: 200, 
    description: '标签删除成功',
    type: Label 
  })
  removeLabel(@Param('id') id: string) {
    return this.labelService.remove(id);
  }
}
