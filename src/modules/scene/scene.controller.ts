import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SceneService } from './scene.service';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('scene')
@ApiTags('scene')
export class SceneController {
  constructor(private readonly sceneService: SceneService) {}


}
