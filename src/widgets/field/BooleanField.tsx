import FieldHeadlessWidget from './Field';

export default class BooleanFieldHeadlessWidget extends FieldHeadlessWidget<boolean> {
  protected get positiveLabel(): string {
    return this.config.positiveLabel || '是';
  }

  protected get negativeLabel(): string {
    return this.config.negativeLabel || '否';
  }

  protected get negativeFirst(): boolean {
    return this.config.negativeFirst || false;
  }
}
