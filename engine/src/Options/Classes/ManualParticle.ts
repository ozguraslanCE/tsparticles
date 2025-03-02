import type { ICoordinatesWithMode } from "../../Core/Interfaces/ICoordinates";
import type { IManualParticle } from "../Interfaces/IManualParticle";
import type { IOptionLoader } from "../Interfaces/IOptionLoader";
import type { IParticlesOptions } from "../Interfaces/Particles/IParticlesOptions";
import { PixelMode } from "../../Enums/Modes/PixelMode";
import type { RecursivePartial } from "../../Types/RecursivePartial";
import { deepExtend } from "../../Utils/Utils";

export class ManualParticle implements IManualParticle, IOptionLoader<IManualParticle> {
    options?: RecursivePartial<IParticlesOptions>;
    position?: ICoordinatesWithMode;

    load(data?: RecursivePartial<IManualParticle>): void {
        if (!data) {
            return;
        }

        if (data.position) {
            this.position = {
                x: data.position.x ?? 50,
                y: data.position.y ?? 50,
                mode: data.position.mode ?? PixelMode.percent,
            };
        }

        if (data.options) {
            this.options = deepExtend({}, data.options) as RecursivePartial<IParticlesOptions>;
        }
    }
}
