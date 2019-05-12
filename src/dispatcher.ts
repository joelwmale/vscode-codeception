import { CommandOptions } from "./interfaces";
import { CodeceptionCommand } from "./commands";

export default function Dispatcher (commandOptions: CommandOptions = {}) {
    return new CodeceptionCommand(commandOptions);
}
