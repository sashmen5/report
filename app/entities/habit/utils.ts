import { COLORS } from '../../lib/colors';
import { HabitTypeId } from '../../models';

const colors = COLORS.Tableau10;

const colorsById: Record<HabitTypeId, string> = {
  'training:gym': colors[0],
  'training:kettlebell': colors[1],
  weight: colors[2],
  '3meals': colors[3],
  '7hoursleep': colors[4],
  coffee: colors[5],
  snack: colors[6],
  steps: colors[7],
  calories: colors[8],
  pullups: colors[9],
  hookah: colors[0],
};

const getHabitColor = (habitTypeId: HabitTypeId): string => colorsById[habitTypeId];

export { getHabitColor };
