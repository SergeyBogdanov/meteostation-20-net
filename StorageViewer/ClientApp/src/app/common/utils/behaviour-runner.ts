export interface WorkingSubject {
    working: boolean;
}

export class BehaviourRunner {
    static async runHeavyOperation(subject: WorkingSubject, operationProc: () => Promise<void>) {
        try {
            subject.working = true;
            await operationProc();
        } finally {
            subject.working = false;
        }
    }
}