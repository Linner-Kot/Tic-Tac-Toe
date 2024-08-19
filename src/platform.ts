export interface platform {
  render: () => void;
  init: () => void;
  input: (row: number, column: number) => boolean;
}
