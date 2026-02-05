import type { AirCompanyCreateDto } from "../../models/air-company/AirCompanyCreateDto";
import type { AirCompany } from "../../models/air-company/AirCompanyDto";

export interface IAirCompanyAPIService {
    getAllCompanies(): Promise<AirCompany[]>;
    getCompanyById(id: number): Promise<AirCompany>;
    createCompany(dto: AirCompanyCreateDto): Promise<AirCompany>;
    updateCompany(id: number, name: string): Promise<AirCompany>;
    deleteCompany(id: number): Promise<void>;
}