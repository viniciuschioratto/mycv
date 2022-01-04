import { Injectable, NotFoundException } from '@nestjs/common';
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

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne(id);

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }
    
}
