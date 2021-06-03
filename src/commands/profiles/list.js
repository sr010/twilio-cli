const chalk = require('chalk');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;

class ProfilesList extends BaseCommand {
  async run() {
    await super.run();
    const envProfile = this.userConfig.getProfileFromEnvironment();
    // If environment profile exists, add required details to userConfig.projects, and mark as active.
    if (envProfile) {
      const { accountSid: ENVIRONMENT_ACCOUNT_SID, region: ENVIRONMENT_REGION } = envProfile;
      const strippedEnvProfile = {
        id: '[env]',
        accountSid: ENVIRONMENT_ACCOUNT_SID,
        region: ENVIRONMENT_REGION,
      };
      this.userConfig.projects.unshift(strippedEnvProfile);
      this.userConfig.setActiveProfile(strippedEnvProfile.id);
    }
    if (this.userConfig.projects.length > 0) {
      // If none of the profiles have a region, delete it from all of them so it doesn't show up in the output.
      if (!this.userConfig.projects.some((p) => p.region)) {
        this.userConfig.projects.forEach((p) => delete p.region);
      }
      const activeProfile = this.userConfig.getActiveProfile();
      this.userConfig.projects.forEach((p) => {
        p.active = p.id === activeProfile.id;
      });
      this.output(this.userConfig.projects);
    } else {
      this.logger.warn(`No profiles have been configured. Run ${chalk.bold('twilio profiles:create')} to create one!`);
    }
  }
}

ProfilesList.description = 'show what profiles you have configured';
ProfilesList.flags = BaseCommand.flags;

module.exports = ProfilesList;
