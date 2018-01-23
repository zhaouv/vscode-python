import { ConfigurationTarget, Disposable, Uri } from 'vscode';
import { Architecture } from '../common/platform/types';

export const INTERPRETER_LOCATOR_SERVICE = 'IInterpreterLocatorService';
export const WINDOWS_REGISTRY_SERVICE = 'WindowsRegistryService';
export const CONDA_ENV_FILE_SERVICE = 'CondaEnvFileService';
export const CONDA_ENV_SERVICE = 'CondaEnvService';
export const CURRENT_PATH_SERVICE = 'CurrentPathService';
export const KNOWN_PATH_SERVICE = 'KnownPathsService';
export const VIRTUAL_ENV_SERVICE = 'VirtualEnvService';

export const IInterpreterVersionService = Symbol('IInterpreterVersionService');
export interface IInterpreterVersionService {
    getVersion(pythonPath: string, defaultValue: string): Promise<string>;
    getPipVersion(pythonPath: string): Promise<string>;
}

export const IKnownSearchPathsForInterpreters = Symbol('IKnownSearchPathsForInterpreters');
export const IKnownSearchPathsForVirtualEnvironments = Symbol('IKnownSearchPathsForVirtualEnvironments');

export const IInterpreterLocatorService = Symbol('IInterpreterLocatorService');

export interface IInterpreterLocatorService extends Disposable {
    getInterpreters(resource?: Uri): Promise<PythonInterpreter[]>;
}

export type CondaInfo = {
    envs?: string[];
    'sys.version'?: string;
    'sys.prefix'?: string;
    'python_version'?: string;
    default_prefix?: string;
};

export const ICondaService = Symbol('ICondaService');

export interface ICondaService {
    readonly condaEnvironmentsFile: string | undefined;
    getCondaFile(): Promise<string>;
    isCondaAvailable(): Promise<boolean>;
    getCondaVersion(): Promise<string | undefined>;
    getCondaInfo(): Promise<CondaInfo | undefined>;
    getCondaEnvironments(): Promise<({ name: string, path: string }[]) | undefined>;
    getInterpreterPath(condaEnvironmentPath: string): string;
}

export enum InterpreterType {
    Unknown = 1,
    Conda = 2,
    VirtualEnv = 4,
    VEnv = 8
}

export type PythonInterpreter = {
    path: string;
    companyDisplayName?: string;
    displayName?: string;
    version?: string;
    architecture?: Architecture;
    type: InterpreterType;
    envName?: string;
    envPath?: string;
};

export type WorkspacePythonPath = {
    folderUri: Uri;
    pytonPath?: string;
    configTarget: ConfigurationTarget.Workspace | ConfigurationTarget.WorkspaceFolder;
};

export const IInterpreterService = Symbol('IInterpreterService');

export interface IInterpreterService {
    getInterpreters(resource?: Uri): Promise<PythonInterpreter[]>;
    autoSetInterpreter(): Promise<void>;
    getActiveInterpreter(resource?: Uri): Promise<PythonInterpreter>;
    refresh(): Promise<void>;
}
