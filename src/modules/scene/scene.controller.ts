import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SceneService } from './scene.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Scene } from './entities/scene.entity';

@Controller('scene')
@ApiTags('scene')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}

  @Post()
  @ApiOperation({ summary: '创建新场景' })
  @ApiResponse({ 
    status: 201, 
    description: '场景创建成功',
    type: Scene 
  })
  createScene(@Body() createSceneDto: CreateSceneDto) {
    return this.sceneService.create(createSceneDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有场景' })
  @ApiResponse({ 
    status: 200, 
    description: '返回所有场景列表',
    type: [Scene]
  })
  findAllScenes() {
    return this.sceneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取场景' })
  @ApiResponse({ 
    status: 200, 
    description: '返回指定场景',
    type: Scene 
  })
  findOneScene(@Param('id') id: string) {
    return this.sceneService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新场景' })
  @ApiResponse({ 
    status: 200, 
    description: '场景更新成功',
    type: Scene 
  })
  updateScene(@Param('id') id: string, @Body() updateSceneDto: UpdateSceneDto) {
    return this.sceneService.update(id, updateSceneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除场景' })
  @ApiResponse({ 
    status: 200, 
    description: '场景删除成功',
    type: Scene 
  })
  removeScene(@Param('id') id: string) {
    return this.sceneService.remove(id);
  }

  @Post(':id/labels/:labelId')
  @ApiOperation({ summary: '为场景添加标签' })
  @ApiResponse({ 
    status: 200, 
    description: '标签添加成功',
    type: Scene 
  })
  addLabel(@Param('id') id: string, @Param('labelId') labelId: string) {
    return this.sceneService.addLabel(id, labelId);
  }

  @Delete(':id/labels/:labelId')
  @ApiOperation({ summary: '从场景移除标签' })
  @ApiResponse({ 
    status: 200, 
    description: '标签移除成功',
    type: Scene 
  })
  removeLabel(@Param('id') id: string, @Param('labelId') labelId: string) {
    return this.sceneService.removeLabel(id, labelId);
  }

  @Get('by-label/:labelId')
  @ApiOperation({ summary: '根据标签查询场景' })
  @ApiResponse({ 
    status: 200, 
    description: '返回带有指定标签的场景列表',
    type: [Scene]
  })
  findByLabel(@Param('labelId') labelId: string) {
    return this.sceneService.findByLabel(labelId);
  }
}
