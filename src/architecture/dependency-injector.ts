import { Container } from 'inversify';

/**
 * Abstract class representing a Dependency Injector.
 *
 * This class should be extended by specific implementations that
 * provide a concrete setup method for setting up dependencies in a
 * Container.
 *
 * @class
 * @abstract
 */
export abstract class DependencyInjector {
  /**
   * Creates an instance of DependencyInjector.
   *
   * @param {Container} container - The dependency injection container
   * into which dependencies will be setup.
   */
  constructor(protected container: Container) {
    this.container = container;
  }

  /**
   * Abstract method to setup dependencies in the container.
   *
   * This method should be overridden in subclasses with specific
   * implementations for setting up dependencies.
   *
   * @abstract
   * @return {Promise<void>} - Promise resolving when setup is complete.
   */
  public abstract setup(...args: unknown[]): Promise<void>;
}
