import { OutMode, OutModeDirection, getValue } from "tsparticles-engine";
import type { IBounceData } from "./IBounceData";

/**
 * @param data -
 */
export function bounceHorizontal(data: IBounceData): void {
    if (
        (data.outMode !== OutMode.bounce &&
            data.outMode !== OutMode.bounceHorizontal &&
            data.outMode !== "bounceHorizontal" &&
            data.outMode !== OutMode.split) ||
        (data.direction !== OutModeDirection.left && data.direction !== OutModeDirection.right)
    ) {
        return;
    }

    if (data.bounds.right < 0 && data.direction === OutModeDirection.left) {
        data.particle.position.x = data.size + data.offset.x;
    } else if (data.bounds.left > data.canvasSize.width && data.direction === OutModeDirection.right) {
        data.particle.position.x = data.canvasSize.width - data.size - data.offset.x;
    }

    const velocity = data.particle.velocity.x;
    let bounced = false;

    if (
        (data.direction === OutModeDirection.right && data.bounds.right >= data.canvasSize.width && velocity > 0) ||
        (data.direction === OutModeDirection.left && data.bounds.left <= 0 && velocity < 0)
    ) {
        const newVelocity = getValue(data.particle.options.bounce.horizontal);

        data.particle.velocity.x *= -newVelocity;

        bounced = true;
    }

    if (!bounced) {
        return;
    }

    const minPos = data.offset.x + data.size;

    if (data.bounds.right >= data.canvasSize.width && data.direction === OutModeDirection.right) {
        data.particle.position.x = data.canvasSize.width - minPos;
    } else if (data.bounds.left <= 0 && data.direction === OutModeDirection.left) {
        data.particle.position.x = minPos;
    }

    if (data.outMode === OutMode.split) {
        data.particle.destroy();
    }
}

/**
 * @param data -
 */
export function bounceVertical(data: IBounceData): void {
    if (
        (data.outMode !== OutMode.bounce &&
            data.outMode !== OutMode.bounceVertical &&
            data.outMode !== "bounceVertical" &&
            data.outMode !== OutMode.split) ||
        (data.direction !== OutModeDirection.bottom && data.direction !== OutModeDirection.top)
    ) {
        return;
    }

    if (data.bounds.bottom < 0 && data.direction === OutModeDirection.top) {
        data.particle.position.y = data.size + data.offset.y;
    } else if (data.bounds.top > data.canvasSize.height && data.direction === OutModeDirection.bottom) {
        data.particle.position.y = data.canvasSize.height - data.size - data.offset.y;
    }

    const velocity = data.particle.velocity.y;
    let bounced = false;

    if (
        (data.direction === OutModeDirection.bottom && data.bounds.bottom >= data.canvasSize.height && velocity > 0) ||
        (data.direction === OutModeDirection.top && data.bounds.top <= 0 && velocity < 0)
    ) {
        const newVelocity = getValue(data.particle.options.bounce.vertical);

        data.particle.velocity.y *= -newVelocity;

        bounced = true;
    }

    if (!bounced) {
        return;
    }

    const minPos = data.offset.y + data.size;

    if (data.bounds.bottom >= data.canvasSize.height && data.direction === OutModeDirection.bottom) {
        data.particle.position.y = data.canvasSize.height - minPos;
    } else if (data.bounds.top <= 0 && data.direction === OutModeDirection.top) {
        data.particle.position.y = minPos;
    }

    if (data.outMode === OutMode.split) {
        data.particle.destroy();
    }
}
