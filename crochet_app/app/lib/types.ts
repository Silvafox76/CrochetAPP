
export interface CrochetPattern {
  id: string;
  title: string;
  description?: string;
  itemType: string;
  skillLevel: string;
  imageUrl?: string;
  estimatedTime?: number;
  isPublic: boolean;
  isCustom: boolean;
  yarnWeight: string;
  hookSize: string;
  gauge?: string;
  difficulty?: string;
  measurements?: any;
  instructions: PatternRow[];
  materials: PatternMaterial[];
  author: {
    name?: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PatternRow {
  id: string;
  rowNumber: number;
  rowType: string;
  instruction: string;
  stitchCount?: number;
  notes?: string;
}

export interface PatternMaterial {
  id: string;
  type: string;
  name: string;
  amount?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  notes?: string;
  status: string;
  currentRow: number;
  imageUrl?: string;
  startedAt?: Date;
  completedAt?: Date;
  pattern?: CrochetPattern;
  progress: ProjectProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectProgress {
  id: string;
  rowNumber: number;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}

export interface YarnCalculation {
  itemType: string;
  size: string;
  yarnWeight: string;
  yardage: number;
  weightGrams?: number;
  notes?: string;
}

export interface StitchInfo {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  difficulty: string;
  description: string;
  instructions: string;
  tips?: string;
  imageUrl?: string;
  symbol?: string;
}

export interface MeasurementInputs {
  itemType: string;
  size?: string;
  customMeasurements?: {
    [key: string]: number;
  };
  yarnWeight: string;
  stitchType: string;
  gauge: {
    stitchesPerInch: number;
    rowsPerInch: number;
  };
}

export interface PatternGenerationResult {
  pattern: CrochetPattern;
  yarnRequirements: {
    yardage: number;
    weight: number;
    skeins: number;
  };
  estimatedTime: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  skillLevel?: string;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  formType?: string;
}
