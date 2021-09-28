import { TextType } from './index.d';

export interface SetYear {
  type: 'set_year';
  payload: number;
}

export interface SetState {
  type: 'set_state';
  payload: string;
}

export interface ClearState {
  type: 'clear_state';
}

export interface SetOffice {
  type: 'set_office';
  payload: string;
}

export interface ClearOffice {
  type: 'clear_office';
}

export interface SetView {
  type: 'set_view';
  payload: string;
}



export interface ShowText {
  type: 'show_text';
  payload: TextType;
}

export interface ClearText {
  type: 'clear_text';
}

export interface Actions extends Array<SetYear | SetState | ClearState | SetOffice | ClearOffice | SetView | ShowText | ClearText> {}
