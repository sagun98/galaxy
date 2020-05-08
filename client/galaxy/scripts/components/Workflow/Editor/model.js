import Vue from "vue";

const outputLabels = {};

export class ActiveOutputs {
    constructor() {
        this.entries = {};
    }

    /** Initialize list of active outputs from server response */
    initialize(outputs, incoming) {
        this.outputs = outputs;
        this.outputsIndex = {};
        outputs.forEach((o) => {
            this.outputsIndex[o.name] = o;
        });
        incoming &&
            incoming.forEach((entry) => {
                this.add(entry.output_name, entry.label);
            });
        this.getAll().forEach((activeOutput) => {
            if (activeOutput.label) {
                outputLabels[activeOutput.label] = true;
            }
        });
    }

    /** Adds a new record to the value stack **/
    add(name, label) {
        if (!this.exists(name)) {
            this.update(name, label);
            return true;
        }
        return false;
    }

    /** Removes all entries which are not in outputNames */
    removeMissing(names) {
        this.getAll().forEach((wf_output) => {
            if (!names[wf_output.output_name]) {
                this.remove(wf_output.output_name);
            }
        });
    }

    /** Toggle an entry */
    toggle(name) {
        const activeOutput = this.get(name);
        const activeLabel = activeOutput && activeOutput.label;
        if (activeLabel && outputLabels[activeLabel]) {
            delete outputLabels[activeLabel];
        }
        if (this.exists(name)) {
            this.remove(name);
        } else {
            this.add(name);
        }
    }

    /** Change label for an output */
    labelOutput(output, newLabel) {
        if (!outputLabels[newLabel]) {
            const oldLabel = this.update(output.name, newLabel);
            if (oldLabel && outputLabels[oldLabel]) {
                delete outputLabels[oldLabel];
            }
            if (newLabel) {
                outputLabels[newLabel] = true;
            }
            return null;
        } else {
            const activeOutput = this.get(output.name);
            return activeOutput && activeOutput.label;
        }
    }

    /** Returns the number of added records **/
    count() {
        return Object.keys(this.entries).length;
    }

    /**  Return label */
    get(name) {
        return this.entries[name];
    }

    /** Returns true if a record is available for a given key **/
    exists(name) {
        return !!this.entries[name];
    }

    /** Remove an entry given its name */
    remove(name) {
        delete this.entries[name];
        this._updateOutput(name);
    }

    /** Returns list of all values */
    getAll() {
        return Object.values(this.entries);
    }

    /** Update an active outputs label */
    update(name, label) {
        const activeOutput = this.entries[name];
        const oldLabel = activeOutput && activeOutput.label;
        this.entries[name] = {
            output_name: name,
            label: label || null,
        };
        this._updateOutput(name);
        return oldLabel;
    }

    /** Update an output */
    _updateOutput(name) {
        const output = this.outputsIndex[name];
        if (output) {
            const activeOutput = this.get(output.name);
            const label = (activeOutput && activeOutput.label) || output.label || output.name;
            Vue.set(output, "isActiveOutput", !!activeOutput);
            Vue.set(output, "labelActive", label);
        }
    }
}
