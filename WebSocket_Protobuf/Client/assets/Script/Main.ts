import CustomWebSocket, { SOCKET_STATE } from "./CustomWebSocket";
import { Person } from "./protobuf/Custom";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    protected onLoad(): void {
        let ws = CustomWebSocket.instance;
        this.scheduleOnce(() => {
            let person: Person = {
                name: "张三",
                age: 18,
                msg: "My name is zhang san, and I'm 18 years old."
            }
            ws.send(person);
        }, 3);
    }
}
