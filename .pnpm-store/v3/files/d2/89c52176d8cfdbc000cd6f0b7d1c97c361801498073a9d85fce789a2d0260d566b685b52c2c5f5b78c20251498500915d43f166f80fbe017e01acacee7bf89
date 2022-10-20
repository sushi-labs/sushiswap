import { Machine } from "./machine.js.js.js";
declare type ContainerState = 'idle' | 'entering' | 'leaving' | 'cancelled' | 'done';
declare type SelfState = 'idle' | 'running' | 'waiting_for_children';
declare type ChildrenState = 'idle' | 'running' | 'waiting_for_self';
declare type UserEvents = {
    type: 'reset';
    payload: undefined;
} | {
    type: 'enter';
    payload: undefined;
} | {
    type: 'leave';
    payload: undefined;
} | {
    type: 'cancel';
    payload: undefined;
} | {
    type: 'start';
    payload: undefined;
} | {
    type: 'stop';
    payload: undefined;
};
declare type InternalEvents = {
    type: '#child.add';
    payload: TransitionMachine;
} | {
    type: '#child.remove';
    payload: TransitionMachine;
} | {
    type: '#child.become';
    payload: TransitionMachine;
} | {
    type: '#child.resign';
    payload: TransitionMachine;
} | {
    type: '#child.start';
    payload: undefined;
} | {
    type: '#child.stop';
    payload: undefined;
} | {
    type: '#debug';
    payload: undefined;
};
export declare type TransitionEvents = UserEvents | InternalEvents;
export declare type TransitionState = readonly [ContainerState, SelfState, ChildrenState];
export declare type TransitionStateDescriptor = {
    readonly container: ContainerState;
    readonly self: SelfState;
    readonly children: ChildrenState;
};
export declare type TransitionStateMatcher = {
    readonly container: readonly ContainerState[];
    readonly self: readonly SelfState[];
    readonly children: readonly ChildrenState[];
};
export declare type TransitionActions = {
    onStart?: () => void;
    onStop?: () => void;
    onCancel?: () => void;
    onEvent?: (event: TransitionEvents['type'], payload?: any) => void;
    onChange?: (before: TransitionState, after: TransitionState) => void;
    onChildStop?: () => void;
};
export interface TransitionMachine extends Machine<TransitionState, TransitionEvents> {
    readonly state: TransitionState;
    add(child: TransitionMachine): void;
    remove(child: TransitionMachine): void;
    send<EventType extends TransitionEvents['type']>(event: EventType, payload?: Extract<TransitionEvents, {
        type: EventType;
    }>['payload']): void;
}
export declare function createTransitionMachine(id: string, actions?: TransitionActions): TransitionMachine;
export {};
