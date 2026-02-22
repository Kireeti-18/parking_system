export interface AlertItem {
  id: string;
  message: string;
  type: AlertType;
}

export type AlertType = 'success' | 'failed' | 'warning' | 'info';
