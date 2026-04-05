/**
 * AgentBus - Simple publish-subscribe message bus for multi-agent communication
 */
class AgentBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name to subscribe to
   * @param {Function} callback - Callback function to execute when event is published
   */
  subscribe(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  /**
   * Publish an event with data
   * @param {string} event - Event name to publish
   * @param {any} data - Data to pass to subscribers
   */
  publish(event, data) {
    if (!this.events[event]) {
      return; // No subscribers for this event
    }

    // Create a copy of the array to avoid issues if callbacks modify the array
    const callbacks = [...this.events[event]];

    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error executing callback for event "${event}":`, error);
      }
    });
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name to unsubscribe from
   * @param {Function} callback - Specific callback to remove
   */
  unsubscribe(event, callback) {
    if (!this.events[event]) {
      return;
    }

    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }

    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }

  /**
   * Get all events and their subscriber counts (for debugging)
   */
  getEvents() {
    const result = {};
    Object.keys(this.events).forEach(event => {
      result[event] = this.events[event].length;
    });
    return result;
  }

  /**
   * Clear all events and subscribers
   */
  clear() {
    this.events = {};
  }
}

// Export singleton instance as default
const agentBus = new AgentBus();
export default agentBus;

// Also export the class for testing purposes
export { AgentBus };