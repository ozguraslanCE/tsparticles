import {
    type Container,
    type CustomEventArgs,
    DestroyType,
    EventType,
    type ISourceOptions,
    MoveDirection,
    OutMode,
    type Particle,
    type RecursivePartial,
    StartValueType,
    getRangeMax,
    getRangeMin,
    isNumber,
    isSsr,
    isString,
    setRangeValue,
    tsParticles,
} from "tsparticles-engine";
import { FireworkOptions } from "./FireworkOptions";
import type { IFireworkOptions } from "./IFireworkOptions";
import { loadBasic } from "tsparticles-basic";
import { loadDestroyUpdater } from "tsparticles-updater-destroy";
import { loadEmittersPlugin } from "tsparticles-plugin-emitters";
import { loadLifeUpdater } from "tsparticles-updater-life";
import { loadLineShape } from "tsparticles-shape-line";
import { loadRotateUpdater } from "tsparticles-updater-rotate";
import { loadSoundsPlugin } from "tsparticles-plugin-sounds";
import { loadStrokeColorUpdater } from "tsparticles-updater-stroke-color";

let initialized = false;
let initializing = false;

declare global {
    interface Window {
        fireworks: ((
            idOrOptions: string | RecursivePartial<IFireworkOptions>,
            sourceOptions?: RecursivePartial<IFireworkOptions>,
        ) => Promise<FireworksInstance | undefined>) & {
            version: string;
        };
    }
}

const explodeSoundCheck = (args: CustomEventArgs): boolean => {
    const data = args.data as { particle: Particle };

    return data.particle.shape === "line";
};

class FireworksInstance {
    private readonly _container: Container;

    constructor(container: Container) {
        this._container = container;
    }

    pause(): void {
        this._container.pause();
    }

    play(): void {
        this._container.play();
    }

    stop(): void {
        this._container.stop();
    }
}

/**
 */
async function initPlugins(): Promise<void> {
    if (initialized) {
        return;
    }

    if (initializing) {
        return new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (!initialized) {
                    return;
                }

                clearInterval(interval);
                resolve();
            }, 100);
        });
    }

    initializing = true;

    await loadEmittersPlugin(tsParticles, false);
    await loadSoundsPlugin(tsParticles, false);
    await loadLineShape(tsParticles, false);
    await loadRotateUpdater(tsParticles, false);
    await loadDestroyUpdater(tsParticles, false);
    await loadLifeUpdater(tsParticles, false);
    await loadStrokeColorUpdater(tsParticles, false);
    await loadBasic(tsParticles, false);

    initializing = false;
    initialized = true;
}

/**
 * @param idOrOptions - the id used for displaying the animation, or the animation configuration if an id is not necessary
 * @param sourceOptions - the animation configuration if an id is provided
 * @returns the loaded instance
 */
export async function fireworks(
    idOrOptions: string | RecursivePartial<IFireworkOptions>,
    sourceOptions?: RecursivePartial<IFireworkOptions>,
): Promise<FireworksInstance | undefined> {
    await initPlugins();

    let id: string;

    const options = new FireworkOptions();

    if (isString(idOrOptions)) {
        id = idOrOptions;
        options.load(sourceOptions);
    } else {
        id = "fireworks";
        options.load(idOrOptions);
    }

    const particlesOptions: ISourceOptions = {
        detectRetina: true,
        background: {
            color: "#000",
        },
        fpsLimit: 120,
        emitters: {
            direction: MoveDirection.top,
            life: {
                count: 0,
                duration: 0.1,
                delay: 0.1,
            },
            rate: {
                delay: isNumber(options.rate)
                    ? 1 / options.rate
                    : { min: 1 / getRangeMin(options.rate), max: 1 / getRangeMax(options.rate) },
                quantity: 1,
            },
            size: {
                width: 100,
                height: 0,
            },
            position: {
                y: 100,
                x: 50,
            },
        },
        particles: {
            number: {
                value: 0,
            },
            color: {
                value: options.colors,
            },
            destroy: {
                mode: "split",
                bounds: {
                    top: setRangeValue(options.minHeight),
                },
                split: {
                    sizeOffset: false,
                    count: 1,
                    factor: {
                        value: 0.333333,
                    },
                    rate: {
                        value: options.splitCount,
                    },
                    colorOffset: {
                        s: options.saturation,
                        l: options.brightness,
                    },
                    particles: {
                        stroke: {
                            width: 0,
                        },
                        number: {
                            value: 0,
                        },
                        opacity: {
                            value: {
                                min: 0.1,
                                max: 1,
                            },
                            animation: {
                                enable: true,
                                speed: 0.7,
                                sync: false,
                                startValue: StartValueType.max,
                                destroy: DestroyType.min,
                            },
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 2 },
                            animation: {
                                enable: true,
                                speed: 5,
                                count: 1,
                                sync: false,
                                startValue: StartValueType.min,
                                destroy: DestroyType.none,
                            },
                        },
                        life: {
                            count: 1,
                            duration: {
                                value: {
                                    min: 0.25,
                                    max: 0.5,
                                },
                            },
                        },
                        move: {
                            decay: { min: 0.05, max: 0.1 },
                            enable: true,
                            gravity: {
                                enable: true,
                                inverse: false,
                                acceleration: setRangeValue(options.gravity),
                            },
                            speed: setRangeValue(options.speed),
                            direction: "none",
                            outModes: OutMode.destroy,
                        },
                    },
                },
            },
            life: {
                count: 1,
            },
            shape: {
                type: "line",
                options: {
                    line: {
                        cap: "round",
                    },
                },
            },
            size: {
                value: {
                    min: 0.1,
                    max: 50,
                },
                animation: {
                    enable: true,
                    sync: true,
                    speed: 90,
                    startValue: StartValueType.max,
                    destroy: DestroyType.min,
                },
            },
            stroke: {
                color: {
                    value: "#ffffff",
                },
                width: 0.5,
            },
            rotate: {
                path: true,
            },
            move: {
                enable: true,
                gravity: {
                    acceleration: 15,
                    enable: true,
                    inverse: true,
                    maxSpeed: 100,
                },
                speed: {
                    min: 10,
                    max: 20,
                },
                outModes: {
                    default: OutMode.destroy,
                    top: OutMode.none,
                },
                trail: {
                    fillColor: "#000",
                    enable: true,
                    length: 10,
                },
            },
        },
        sounds: {
            enable: options.sounds,
            events: [
                {
                    event: EventType.particleRemoved,
                    filter: explodeSoundCheck,
                    audio: [
                        "https://particles.js.org/audio/explosion0.mp3",
                        "https://particles.js.org/audio/explosion1.mp3",
                        "https://particles.js.org/audio/explosion2.mp3",
                    ],
                },
            ],
            volume: 50,
        },
    };

    const container = await tsParticles.load({ id, options: particlesOptions });

    if (!container) {
        return;
    }

    return new FireworksInstance(container);
}

fireworks.version = tsParticles.version;

if (!isSsr()) {
    window.fireworks = fireworks;
}
