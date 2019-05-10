import { CommandOptions } from '../types/commandOptions';
import { CodeceptionCommand } from './codeception';

export default function Dispatcher (commandOptions: CommandOptions = {}) {
    return new CodeceptionCommand(commandOptions);
}
