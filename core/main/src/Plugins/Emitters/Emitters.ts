import type { IContainerPlugin } from "../../Core/Interfaces/IContainerPlugin";
import { EmitterInstance } from "./EmitterInstance";
import type { Container } from "../../Core/Container";
import type { IEmitter } from "./Options/Interfaces/IEmitter";
import { Utils } from "../../Utils";
import type { RecursivePartial, SingleOrMultiple } from "../../Types";
import { Emitter } from "./Options/Classes/Emitter";
import type { IOptions } from "../../Options/Interfaces/IOptions";
import { EmitterClickMode } from "./Enums";
import type { IEmitterOptions } from "./Options/Interfaces/IEmitterOptions";
import type { ICoordinates } from "../../Core/Interfaces/ICoordinates";
import type { EmitterContainer } from "./EmitterContainer";

/**
 * @category Emitters Plugin
 */
export class Emitters implements IContainerPlugin {
    public array: EmitterInstance[];
    public emitters: SingleOrMultiple<Emitter>;
    public interactivityEmitters: SingleOrMultiple<Emitter>;

    constructor(private readonly container: Container) {
        this.array = [];
        this.emitters = [];
        this.interactivityEmitters = [];

        const overridableContainer = (container as unknown) as EmitterContainer;

        overridableContainer.addEmitter = (options: IEmitter, position?: ICoordinates) =>
            this.addEmitter(options, position);

        overridableContainer.playEmitter = (idxOrName?: number | string) => {
            const emitter =
                idxOrName === undefined || typeof idxOrName === "number"
                    ? this.array[idxOrName || 0]
                    : this.array.find((t) => t.name === idxOrName);

            if (emitter) {
                emitter.play();
            }
        };

        overridableContainer.pauseEmitter = (idxOrName?: number | string) => {
            const emitter =
                idxOrName === undefined || typeof idxOrName === "number"
                    ? this.array[idxOrName || 0]
                    : this.array.find((t) => t.name === idxOrName);

            if (emitter) {
                emitter.pause();
            }
        };
    }

    public init(options?: RecursivePartial<IOptions & IEmitterOptions>): void {
        if (!options) {
            return;
        }

        if (options.emitters) {
            if (options.emitters instanceof Array) {
                this.emitters = options.emitters.map((s) => {
                    const tmp = new Emitter();

                    tmp.load(s);

                    return tmp;
                });
            } else {
                if (this.emitters instanceof Array) {
                    this.emitters = new Emitter();
                }

                this.emitters.load(options.emitters);
            }
        }

        const interactivityEmitters = options.interactivity?.modes?.emitters;

        if (interactivityEmitters) {
            if (interactivityEmitters instanceof Array) {
                this.interactivityEmitters = interactivityEmitters.map((s) => {
                    const tmp = new Emitter();

                    tmp.load(s);

                    return tmp;
                });
            } else {
                if (this.interactivityEmitters instanceof Array) {
                    this.interactivityEmitters = new Emitter();
                }

                this.interactivityEmitters.load(interactivityEmitters);
            }
        }

        if (this.emitters instanceof Array) {
            for (const emitterOptions of this.emitters) {
                this.addEmitter(emitterOptions);
            }
        } else {
            this.addEmitter(this.emitters);
        }
    }

    public play(): void {
        for (const emitter of this.array) {
            emitter.play();
        }
    }

    public pause(): void {
        for (const emitter of this.array) {
            emitter.pause();
        }
    }

    public stop(): void {
        this.array = [];
    }

    public handleClickMode(mode: string): void {
        const container = this.container;
        const emitterOptions = this.emitters;
        const modeEmitters = this.interactivityEmitters;

        if (mode === EmitterClickMode.emitter) {
            let emitterModeOptions: IEmitter | undefined;

            if (modeEmitters instanceof Array) {
                if (modeEmitters.length > 0) {
                    emitterModeOptions = Utils.itemFromArray(modeEmitters);
                }
            } else {
                emitterModeOptions = modeEmitters;
            }

            const emittersOptions =
                emitterModeOptions ??
                (emitterOptions instanceof Array ? Utils.itemFromArray(emitterOptions) : emitterOptions);
            const ePosition = container.interactivity.mouse.clickPosition;

            this.addEmitter(Utils.deepExtend({}, emittersOptions) as IEmitter, ePosition);
        }
    }

    public resize(): void {
        for (const emitter of this.array) {
            emitter.resize();
        }
    }

    public addEmitter(options: IEmitter, position?: ICoordinates): EmitterInstance {
        const emitter = new EmitterInstance(this, this.container, options, position);

        this.array.push(emitter);

        return emitter;
    }

    public removeEmitter(emitter: EmitterInstance): void {
        const index = this.array.indexOf(emitter);

        if (index >= 0) {
            this.array.splice(index, 1);
        }
    }
}
