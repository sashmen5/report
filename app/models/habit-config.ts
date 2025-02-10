import mongoose from 'mongoose';

const habitTypeId = [
  'training:gym',
  'training:kettlebell',
  'weight',
  '3meals',
  '7hoursleep',
  'coffee',
  'snack',
  'steps',
  'calories',
  'pullups',
] as const;

const habitValueType = ['bool', 'numeric'] as const;

type HabitTypeId = (typeof habitTypeId)[number];
type HabitValueType = (typeof habitValueType)[number];

interface HabitConfigDTO {
  habitTypeId: HabitTypeId;
  valueType: HabitValueType;
  description?: string;
  name?: string;
  defaultValue: boolean | string;
}

interface IHabitConfig extends HabitConfigDTO, mongoose.Document {}

const habitConfigs = new mongoose.Schema({
  habitTypeId: {
    type: String,
    required: [true, 'Please provide habit type id'],
    unique: true,
  },
  valueType: {
    type: String,
    required: [true, 'Please provide value type'],
  },
  description: {
    type: String,
  },
  name: {
    type: String,
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please provide default value'],
  },
});

const HabitConfig: mongoose.Model<IHabitConfig> =
  mongoose.models?.HabitConfig || mongoose.model('HabitConfig', habitConfigs);

export { HabitConfig, type IHabitConfig, type HabitConfigDTO, type HabitTypeId };
