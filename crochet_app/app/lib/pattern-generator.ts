
import crochetData from '../data/crochet_domain_knowledge.json';
import { MeasurementInputs, PatternGenerationResult, CrochetPattern, PatternRow, PatternMaterial } from './types';

export class PatternGenerator {
  private crochetKnowledge: any;

  constructor() {
    this.crochetKnowledge = crochetData;
  }

  generatePattern(inputs: MeasurementInputs): PatternGenerationResult {
    const { itemType, size, customMeasurements, yarnWeight, stitchType, gauge } = inputs;

    let pattern: CrochetPattern;
    let yarnRequirements: any;
    let estimatedTime: number;

    switch (itemType.toLowerCase()) {
      case 'hat':
        pattern = this.generateHatPattern(inputs);
        break;
      case 'scarf':
        pattern = this.generateScarfPattern(inputs);
        break;
      case 'blanket':
        pattern = this.generateBlanketPattern(inputs);
        break;
      default:
        throw new Error(`Pattern generation for ${itemType} not yet supported`);
    }

    yarnRequirements = this.calculateYarnRequirements(pattern, yarnWeight);
    estimatedTime = this.calculateEstimatedTime(pattern, inputs.itemType);

    return {
      pattern,
      yarnRequirements,
      estimatedTime
    };
  }

  private generateHatPattern(inputs: MeasurementInputs): CrochetPattern {
    const { size, yarnWeight, stitchType, gauge } = inputs;
    
    // Get hat dimensions from knowledge base
    const hatSizes = this.crochetKnowledge.patternConstruction.hats.sizes;
    const hatInfo = hatSizes[size as keyof typeof hatSizes] || hatSizes.adult_medium;
    
    const circumference = hatInfo.circumference;
    const height = hatInfo.height;
    
    // Calculate stitches needed based on gauge
    const stitchesNeeded = Math.round((circumference * gauge.stitchesPerInch));
    const rowsNeeded = Math.round(height * gauge.rowsPerInch);
    
    // Generate crown
    const crownRows = this.generateCrownRows(stitchesNeeded, stitchType);
    const bodyRows = this.generateBodyRows(stitchesNeeded, rowsNeeded - crownRows.length, stitchType);
    
    const instructions: PatternRow[] = [
      {
        id: 'header',
        rowNumber: 0,
        rowType: 'header',
        instruction: `Custom ${size} Hat Pattern`,
        stitchCount: 0
      },
      ...crownRows,
      ...bodyRows
    ];

    const materials: PatternMaterial[] = [
      {
        id: 'yarn',
        type: 'yarn',
        name: `${this.getYarnWeightName(yarnWeight)} yarn`,
        amount: 'See yarn calculator for exact amount'
      },
      {
        id: 'hook',
        type: 'hook',
        name: this.getRecommendedHookSize(yarnWeight),
        amount: '1'
      },
      {
        id: 'notions',
        type: 'notions',
        name: 'Yarn needle, stitch markers',
        amount: '1 set'
      }
    ];

    return {
      id: 'generated',
      title: `Custom ${size} Hat`,
      description: `A custom-fitted hat pattern generated for your measurements`,
      itemType: 'hat',
      skillLevel: 'intermediate',
      isPublic: false,
      isCustom: true,
      yarnWeight,
      hookSize: this.getRecommendedHookSize(yarnWeight),
      gauge: `${gauge.stitchesPerInch} sts/inch, ${gauge.rowsPerInch} rows/inch`,
      measurements: inputs.customMeasurements,
      instructions,
      materials,
      author: { name: 'Pattern Generator' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateScarfPattern(inputs: MeasurementInputs): CrochetPattern {
    const { size, yarnWeight, stitchType, gauge } = inputs;
    
    // Get scarf dimensions from knowledge base
    const scarfSizes = this.crochetKnowledge.patternConstruction.scarves.sizes;
    const scarfInfo = scarfSizes[size as keyof typeof scarfSizes] || scarfSizes.adult;
    
    const width = scarfInfo.width;
    const length = scarfInfo.length;
    
    // Calculate stitches and rows
    const stitchesNeeded = Math.round(width * gauge.stitchesPerInch);
    const rowsNeeded = Math.round(length * gauge.rowsPerInch);
    
    const instructions: PatternRow[] = [
      {
        id: 'header',
        rowNumber: 0,
        rowType: 'header',
        instruction: `Custom ${size} Scarf Pattern`,
        stitchCount: 0
      },
      {
        id: 'foundation',
        rowNumber: 1,
        rowType: 'foundation',
        instruction: `Chain ${stitchesNeeded + this.getChainAddition(stitchType)}`,
        stitchCount: stitchesNeeded
      }
    ];

    // Add main body rows
    for (let row = 2; row <= rowsNeeded + 1; row++) {
      instructions.push({
        id: `row-${row}`,
        rowNumber: row,
        rowType: 'instruction',
        instruction: `${this.getStitchName(stitchType)} in each stitch across. Chain ${this.getChainAddition(stitchType)}, turn. (${stitchesNeeded} sts)`,
        stitchCount: stitchesNeeded
      });
    }

    const materials: PatternMaterial[] = [
      {
        id: 'yarn',
        type: 'yarn',
        name: `${this.getYarnWeightName(yarnWeight)} yarn`,
        amount: 'See yarn calculator for exact amount'
      },
      {
        id: 'hook',
        type: 'hook',
        name: this.getRecommendedHookSize(yarnWeight),
        amount: '1'
      }
    ];

    return {
      id: 'generated',
      title: `Custom ${size} Scarf`,
      description: `A custom scarf pattern generated for your specifications`,
      itemType: 'scarf',
      skillLevel: 'beginner',
      isPublic: false,
      isCustom: true,
      yarnWeight,
      hookSize: this.getRecommendedHookSize(yarnWeight),
      gauge: `${gauge.stitchesPerInch} sts/inch, ${gauge.rowsPerInch} rows/inch`,
      measurements: inputs.customMeasurements,
      instructions,
      materials,
      author: { name: 'Pattern Generator' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateBlanketPattern(inputs: MeasurementInputs): CrochetPattern {
    const { size, yarnWeight, stitchType, gauge } = inputs;
    
    // Get blanket dimensions from knowledge base
    const blanketSizes = this.crochetKnowledge.patternConstruction.blankets.sizes;
    const blanketInfo = blanketSizes[size as keyof typeof blanketSizes] || blanketSizes.throw;
    
    const width = blanketInfo.width;
    const length = blanketInfo.length;
    
    // Calculate stitches and rows
    const stitchesNeeded = Math.round(width * gauge.stitchesPerInch);
    const rowsNeeded = Math.round(length * gauge.rowsPerInch);
    
    const instructions: PatternRow[] = [
      {
        id: 'header',
        rowNumber: 0,
        rowType: 'header',
        instruction: `Custom ${size} Blanket Pattern`,
        stitchCount: 0
      },
      {
        id: 'foundation',
        rowNumber: 1,
        rowType: 'foundation',
        instruction: `Chain ${stitchesNeeded + this.getChainAddition(stitchType)}`,
        stitchCount: stitchesNeeded
      }
    ];

    // Add main body rows
    for (let row = 2; row <= rowsNeeded + 1; row++) {
      instructions.push({
        id: `row-${row}`,
        rowNumber: row,
        rowType: 'instruction',
        instruction: `${this.getStitchName(stitchType)} in each stitch across. Chain ${this.getChainAddition(stitchType)}, turn. (${stitchesNeeded} sts)`,
        stitchCount: stitchesNeeded
      });
    }

    const materials: PatternMaterial[] = [
      {
        id: 'yarn',
        type: 'yarn',
        name: `${this.getYarnWeightName(yarnWeight)} yarn`,
        amount: 'See yarn calculator for exact amount'
      },
      {
        id: 'hook',
        type: 'hook',
        name: this.getRecommendedHookSize(yarnWeight),
        amount: '1'
      }
    ];

    return {
      id: 'generated',
      title: `Custom ${size} Blanket`,
      description: `A custom blanket pattern generated for your specifications`,
      itemType: 'blanket',
      skillLevel: 'intermediate',
      isPublic: false,
      isCustom: true,
      yarnWeight,
      hookSize: this.getRecommendedHookSize(yarnWeight),
      gauge: `${gauge.stitchesPerInch} sts/inch, ${gauge.rowsPerInch} rows/inch`,
      measurements: inputs.customMeasurements,
      instructions,
      materials,
      author: { name: 'Pattern Generator' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateCrownRows(finalStitches: number, stitchType: string): PatternRow[] {
    const rows: PatternRow[] = [];
    let currentStitches = 6; // Start with magic ring of 6
    let rowNumber = 1;

    rows.push({
      id: `crown-${rowNumber}`,
      rowNumber: rowNumber++,
      rowType: 'foundation',
      instruction: 'Magic ring, 6 sc in ring. Join with sl st. (6 sts)',
      stitchCount: 6
    });

    while (currentStitches < finalStitches) {
      const increases = Math.min(6, finalStitches - currentStitches);
      const stitchesPerIncrease = Math.floor(currentStitches / increases);
      
      let instruction = '';
      if (stitchesPerIncrease === 1) {
        instruction = `2 ${this.getStitchAbbrev(stitchType)} in each st around. Join. (${currentStitches + increases} sts)`;
      } else {
        instruction = `*${this.getStitchAbbrev(stitchType)} in next ${stitchesPerIncrease} sts, 2 ${this.getStitchAbbrev(stitchType)} in next st*; repeat around. Join. (${currentStitches + increases} sts)`;
      }

      rows.push({
        id: `crown-${rowNumber}`,
        rowNumber: rowNumber++,
        rowType: 'instruction',
        instruction,
        stitchCount: currentStitches + increases
      });

      currentStitches += increases;
    }

    return rows;
  }

  private generateBodyRows(stitches: number, numRows: number, stitchType: string): PatternRow[] {
    const rows: PatternRow[] = [];
    let startRow = 10; // Assuming crown takes about 9-10 rows

    for (let i = 0; i < numRows; i++) {
      rows.push({
        id: `body-${startRow + i}`,
        rowNumber: startRow + i,
        rowType: 'instruction',
        instruction: `${this.getStitchName(stitchType)} in each stitch around. Join. (${stitches} sts)`,
        stitchCount: stitches
      });
    }

    return rows;
  }

  private calculateYarnRequirements(pattern: CrochetPattern, yarnWeight: string): any {
    // Estimate based on stitch count and yarn weight
    const totalStitches = pattern.instructions.reduce((sum, row) => 
      sum + (row.stitchCount || 0), 0
    );

    const yarnData = this.crochetKnowledge.yarnWeights[yarnWeight];
    const averageYardsPerStitch = this.getYardsPerStitch(yarnWeight);
    
    const estimatedYardage = Math.ceil(totalStitches * averageYardsPerStitch);
    const estimatedWeight = Math.ceil(estimatedYardage / (yarnData?.yardsPerOz || 100) * 28.35); // grams
    
    // Estimate number of skeins (assuming 200-yard average skein)
    const averageSkeinYardage = 200;
    const estimatedSkeins = Math.ceil(estimatedYardage / averageSkeinYardage);

    return {
      yardage: estimatedYardage,
      weight: estimatedWeight,
      skeins: estimatedSkeins
    };
  }

  private calculateEstimatedTime(pattern: CrochetPattern, itemType: string): number {
    // Estimate based on stitch count and item complexity
    const totalStitches = pattern.instructions.reduce((sum, row) => 
      sum + (row.stitchCount || 0), 0
    );

    const baseMinutesPerStitch = {
      'hat': 0.5,
      'scarf': 0.3,
      'blanket': 0.4
    };

    return Math.ceil(totalStitches * (baseMinutesPerStitch[itemType as keyof typeof baseMinutesPerStitch] || 0.4));
  }

  private getYardsPerStitch(yarnWeight: string): number {
    const yardageMap: { [key: string]: number } = {
      'lace': 0.1,
      'sport': 0.15,
      'dk': 0.2,
      'worsted': 0.25,
      'chunky': 0.4,
      'super_chunky': 0.6
    };
    return yardageMap[yarnWeight] || 0.25;
  }

  private getYarnWeightName(weight: string): string {
    const names: { [key: string]: string } = {
      'lace': 'Lace Weight',
      'sport': 'Sport Weight',
      'dk': 'DK Weight',
      'worsted': 'Worsted Weight',
      'chunky': 'Chunky Weight',
      'super_chunky': 'Super Chunky Weight'
    };
    return names[weight] || 'Worsted Weight';
  }

  private getRecommendedHookSize(yarnWeight: string): string {
    const hookSizes: { [key: string]: string } = {
      'lace': 'B/2.25mm - E/3.5mm',
      'sport': 'E/3.5mm - G/4mm',
      'dk': 'G/4mm - I/5.5mm',
      'worsted': 'I/5.5mm - K/6.5mm',
      'chunky': 'K/6.5mm - M/9mm',
      'super_chunky': 'M/9mm - P/15mm'
    };
    return hookSizes[yarnWeight] || 'I/5.5mm';
  }

  private getStitchName(stitchType: string): string {
    const names: { [key: string]: string } = {
      'sc': 'Single crochet',
      'hdc': 'Half double crochet',
      'dc': 'Double crochet'
    };
    return names[stitchType] || 'Single crochet';
  }

  private getStitchAbbrev(stitchType: string): string {
    return stitchType || 'sc';
  }

  private getChainAddition(stitchType: string): number {
    const chains: { [key: string]: number } = {
      'sc': 1,
      'hdc': 2,
      'dc': 3
    };
    return chains[stitchType] || 1;
  }
}
