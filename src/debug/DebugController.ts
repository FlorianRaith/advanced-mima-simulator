import Controller from '@/engine/Controller';
import { RenderPipeline } from '@/engine/Renderer';
import ConnectingLine, { LineType } from '@/engine/lines/ConnectingLine';
import { ConnectPoint } from '@/engine/lines/ConnectPoint';
import Box from '@/debug/Box';
import { LineBranch } from '@/engine/lines/Line';

export const DEBUG = false;

export default class DebugController extends Controller {
    create(renderPipeline: RenderPipeline): void {
        const mainConnector = new ConnectingLine(
            new ConnectPoint(0, -200),
            new ConnectPoint(0, 200),
            LineType.BIDIRECTIONAL
        );

        const mainConnector2 = new ConnectingLine(new ConnectPoint(-250, -150), new ConnectPoint(200, -150));

        const box1 = new Box(-200, -100, 25, 25);
        const box2 = new Box(170, 50, 25, 25);

        const connector1 = new ConnectingLine(box1, box2, LineType.BIDIRECTIONAL, LineBranch.X_FIRST);
        const connector2 = new ConnectingLine(
            box2,
            new ConnectPoint(300, 150),
            LineType.BIDIRECTIONAL,
            LineBranch.AUTO_MIDDLE
        );
        const connector3 = new ConnectingLine(box2, mainConnector, LineType.BIDIRECTIONAL, LineBranch.AUTO_MIDDLE);

        const connector4 = new ConnectingLine(box1, mainConnector2, LineType.BIDIRECTIONAL, LineBranch.AUTO_MIDDLE);

        renderPipeline.addAll(
            mainConnector,
            mainConnector2,
            box1,
            box2,
            connector1,
            connector2,
            connector3,
            connector4
        );
    }
    destroy(): void {}
}
