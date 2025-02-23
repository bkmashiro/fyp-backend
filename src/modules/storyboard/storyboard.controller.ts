import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryboardService } from './storyboard.service';
import { CreateStoryboardDto } from './dto/create-storyboard.dto';
import { UpdateStoryboardDto } from './dto/update-storyboard.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('storyboard')
@ApiTags('storyboard')
export class StoryboardController {
  constructor(private readonly storyboardService: StoryboardService) {}


}
