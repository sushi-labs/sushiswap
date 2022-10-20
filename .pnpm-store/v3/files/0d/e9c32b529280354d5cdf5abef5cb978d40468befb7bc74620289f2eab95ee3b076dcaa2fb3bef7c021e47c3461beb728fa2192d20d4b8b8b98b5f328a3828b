import * as React from 'react';
import { OnChangeCallback } from './eventManager';
import { ToastContent, ToastOptions, ToastContainerProps, UpdateOptions, ClearWaitingQueueParams, TypeOptions } from '../types';
declare function toast(content: ToastContent, options?: ToastOptions): React.ReactText;
declare namespace toast {
    var loading: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var promise: typeof handlePromise;
    var success: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var info: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var error: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var warning: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var warn: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var dark: (content: ToastContent, options?: ToastOptions<{}> | undefined) => React.ReactText;
    var dismiss: (id?: string | number | undefined) => void;
    var clearWaitingQueue: (params?: ClearWaitingQueueParams) => void;
    var isActive: (id: React.ReactText) => boolean;
    var update: (toastId: React.ReactText, options?: UpdateOptions) => void;
    var done: (id: React.ReactText) => void;
    var onChange: (callback: OnChangeCallback) => () => void;
    var configure: (config?: ToastContainerProps) => void;
    var POSITION: {
        TOP_LEFT: import("../types").ToastPosition;
        TOP_RIGHT: import("../types").ToastPosition;
        TOP_CENTER: import("../types").ToastPosition;
        BOTTOM_LEFT: import("../types").ToastPosition;
        BOTTOM_RIGHT: import("../types").ToastPosition;
        BOTTOM_CENTER: import("../types").ToastPosition;
    };
    var TYPE: {
        INFO: TypeOptions;
        SUCCESS: TypeOptions;
        WARNING: TypeOptions;
        ERROR: TypeOptions;
        DEFAULT: TypeOptions;
    };
}
export interface ToastPromiseParams {
    pending?: string | UpdateOptions;
    success?: string | UpdateOptions;
    error?: string | UpdateOptions;
}
declare function handlePromise<T>(promise: Promise<T> | (() => Promise<T>), { pending, error, success }: ToastPromiseParams, options?: ToastOptions): Promise<T>;
export { toast };
