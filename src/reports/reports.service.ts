import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReporteDto } from './dtos/create-reports.dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ){}

    create(reportDto: CreateReporteDto, user: User) {
        const report = this.repo.create(reportDto)
        report.user = user

        return this.repo.save(report)
    }

    
}
