/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: State Machines & Concurrency Places
 */

import { EpistemicStatus } from "../ledger/evidence_ledger";

export interface StateNode {
  id: string;
  name: string;
  isInitial: boolean;
  isTerminal: boolean;
  isObservedInTests: boolean;
  isObservedInProduction: boolean;
}

export interface StateTransition {
  id: string;
  fromStateId: string;
  toStateId: string;
  triggerEvent: string;
  guardCondition?: string;
  evidenceIds: string[];
}

export interface SystemStateMachine {
  id: string;
  name: string;
  ownerEntityId: string;
  status: EpistemicStatus;
  states: StateNode[];
  transitions: StateTransition[];
  concurrencyHazards: Array<{
    type: "DEADLOCK" | "RACE_CONDITION" | "STARVATION";
    description: string;
    involvedStates: string[];
    evidenceIds: string[];
  }>;
}
