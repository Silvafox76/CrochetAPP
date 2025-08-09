
import crochetData from '../data/crochet_domain_knowledge.json';
import { YarnCalculation } from './types';

export class YarnCalculator {
  private crochetKnowledge: any;

  constructor() {
    this.crochetKnowledge = crochetData;
  }

  calculateYarnNeeds(
    itemType: string,
    size: string,
    yarnWeight: string,
    customDimensions?: { width?: number; length?: number; circumference?: number }
  ): YarnCalculation {
    let dimensions: any;

    // Get dimensions based on item type and size
    if (customDimensions) {
      dimensions = customDimensions;
    } else {
      dimensions = this.getStandardDimensions(itemType, size);
    }

    // Calculate surface area or volume
    const surfaceArea = this.calculateSurfaceArea(itemType, dimensions);
    
    // Get yarn weight data
    const yarnData = this.crochetKnowledge.yarnWeights[yarnWeight];
    
    // Calculate yardage based on surface area and yarn weight
    const yardage = this.calculateYardage(surfaceArea, yarnWeight, itemType);
    
    // Calculate weight in grams
    const weightGrams = this.calculateWeight(yardage, yarnWeight);

    return {
      itemType,
      size,
      yarnWeight,
      yardage,
      weightGrams,
      notes: this.generateNotes(itemType, yarnWeight)
    };
  }

  convertYarnWeight(fromWeight: string, toWeight: string, originalYardage: number): {
    convertedYardage: number;
    adjustmentNotes: string;
  } {
    const conversionFactors: { [key: string]: number } = {
      'lace': 0.5,
      'sport': 0.7,
      'dk': 0.85,
      'worsted': 1.0,
      'chunky': 1.3,
      'super_chunky': 1.8
    };

    const fromFactor = conversionFactors[fromWeight] || 1.0;
    const toFactor = conversionFactors[toWeight] || 1.0;
    
    const convertedYardage = Math.ceil(originalYardage * (fromFactor / toFactor));
    
    let adjustmentNotes = '';
    if (toFactor > fromFactor) {
      adjustmentNotes = 'You may need a larger hook size and your finished item will be larger.';
    } else if (toFactor < fromFactor) {
      adjustmentNotes = 'You may need a smaller hook size and your finished item will be more compact.';
    } else {
      adjustmentNotes = 'Direct conversion - similar characteristics.';
    }

    return {
      convertedYardage,
      adjustmentNotes
    };
  }

  convertHookSize(yarnWeight: string, units: 'mm' | 'us' = 'us'): string[] {
    const hookSizes = this.crochetKnowledge.hookSizes;
    const yarnData = this.crochetKnowledge.yarnWeights[yarnWeight];
    
    if (!yarnData?.recommendedHookSizes) {
      return ['I/5.5mm']; // default
    }

    return yarnData.recommendedHookSizes.map((size: string) => {
      if (units === 'mm') {
        return this.convertToMM(size);
      }
      return size;
    });
  }

  private getStandardDimensions(itemType: string, size: string): any {
    switch (itemType.toLowerCase()) {
      case 'hat':
        const hatSizes = this.crochetKnowledge.patternConstruction?.hats?.sizes;
        return hatSizes?.[size] || { circumference: 22, height: 8 };
      
      case 'scarf':
        const scarfSizes = this.crochetKnowledge.patternConstruction?.scarves?.sizes;
        return scarfSizes?.[size] || { width: 8, length: 60 };
      
      case 'blanket':
        const blanketSizes = this.crochetKnowledge.patternConstruction?.blankets?.sizes;
        return blanketSizes?.[size] || { width: 50, length: 60 };
      
      default:
        return { width: 12, length: 12 }; // square default
    }
  }

  private calculateSurfaceArea(itemType: string, dimensions: any): number {
    switch (itemType.toLowerCase()) {
      case 'hat':
        // Simplified: circumference * height + crown area
        const crownRadius = dimensions.circumference / (2 * Math.PI);
        const crownArea = Math.PI * crownRadius * crownRadius;
        const sideArea = dimensions.circumference * dimensions.height;
        return crownArea + sideArea;
      
      case 'scarf':
        return dimensions.width * dimensions.length;
      
      case 'blanket':
        return dimensions.width * dimensions.length;
      
      default:
        return dimensions.width * dimensions.length || 144; // default square foot
    }
  }

  private calculateYardage(surfaceArea: number, yarnWeight: string, itemType: string): number {
    // Base yards per square inch for different yarn weights
    const baseYardsPerSqIn: { [key: string]: number } = {
      'lace': 8,
      'sport': 6,
      'dk': 4,
      'worsted': 3,
      'chunky': 2,
      'super_chunky': 1.5
    };

    // Complexity factors for different items
    const complexityFactor: { [key: string]: number } = {
      'hat': 1.2, // includes shaping
      'scarf': 1.0, // straightforward
      'blanket': 1.1, // some border work
      'sweater': 1.5, // complex shaping
      'amigurumi': 1.3 // stuffed, denser stitches
    };

    const baseYards = baseYardsPerSqIn[yarnWeight] || 3;
    const complexity = complexityFactor[itemType] || 1.0;
    
    return Math.ceil(surfaceArea * baseYards * complexity);
  }

  private calculateWeight(yardage: number, yarnWeight: string): number {
    // Average yards per ounce for different weights
    const yardsPerOz: { [key: string]: number } = {
      'lace': 400,
      'sport': 300,
      'dk': 200,
      'worsted': 180,
      'chunky': 120,
      'super_chunky': 80
    };

    const avgYardsPerOz = yardsPerOz[yarnWeight] || 180;
    const ounces = yardage / avgYardsPerOz;
    return Math.ceil(ounces * 28.35); // Convert to grams
  }

  private generateNotes(itemType: string, yarnWeight: string): string {
    const itemNotes: { [key: string]: string } = {
      'hat': 'Add 10% extra for gauge swatching and potential adjustments.',
      'scarf': 'Consider adding 5-10% extra for fringe or tassels if desired.',
      'blanket': 'Large projects may require dye lot matching - buy all yarn at once.',
      'sweater': 'Complex garment - recommend adding 15-20% extra for fitting adjustments.'
    };

    const weightNotes: { [key: string]: string } = {
      'lace': 'Delicate yarn - handle gently and consider blocking requirements.',
      'chunky': 'Works up quickly but uses more yarn per square inch.',
      'super_chunky': 'Very bulky - ensure your hook can accommodate the thickness.'
    };

    let notes = itemNotes[itemType] || 'Standard project calculation.';
    if (weightNotes[yarnWeight]) {
      notes += ` ${weightNotes[yarnWeight]}`;
    }

    return notes;
  }

  private convertToMM(usSize: string): string {
    const conversions: { [key: string]: string } = {
      'B/2.25mm': '2.25mm',
      'C/2.75mm': '2.75mm',
      'D/3.25mm': '3.25mm',
      'E/3.5mm': '3.5mm',
      'F/3.75mm': '3.75mm',
      'G/4mm': '4mm',
      'H/5mm': '5mm',
      'I/5.5mm': '5.5mm',
      'J/6mm': '6mm',
      'K/6.5mm': '6.5mm',
      'L/8mm': '8mm',
      'M/9mm': '9mm',
      'N/10mm': '10mm',
      'P/15mm': '15mm'
    };
    return conversions[usSize] || usSize;
  }

  // Gauge calculator helper methods
  calculateGauge(stitches: number, rows: number, sampleSize: number = 4): {
    stitchesPerInch: number;
    rowsPerInch: number;
  } {
    return {
      stitchesPerInch: stitches / sampleSize,
      rowsPerInch: rows / sampleSize
    };
  }

  adjustForGauge(
    patternGauge: { stitchesPerInch: number; rowsPerInch: number },
    actualGauge: { stitchesPerInch: number; rowsPerInch: number },
    originalYardage: number
  ): {
    adjustedYardage: number;
    hookAdjustment: string;
  } {
    const stitchRatio = patternGauge.stitchesPerInch / actualGauge.stitchesPerInch;
    const adjustedYardage = Math.ceil(originalYardage * stitchRatio * stitchRatio);
    
    let hookAdjustment = '';
    if (actualGauge.stitchesPerInch < patternGauge.stitchesPerInch) {
      hookAdjustment = 'Try a smaller hook size';
    } else if (actualGauge.stitchesPerInch > patternGauge.stitchesPerInch) {
      hookAdjustment = 'Try a larger hook size';
    } else {
      hookAdjustment = 'Gauge matches - no adjustment needed';
    }

    return {
      adjustedYardage,
      hookAdjustment
    };
  }
}
