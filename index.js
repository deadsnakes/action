const os = require('os');
const path = require('path');
const core = require('@actions/core');
const exec = require('@actions/exec');

async function main() {
    let ppa, version = core.getInput('python-version');
    const versionF = parseFloat(version);

    if (version.endsWith('-dev')) {
        version = version.replace(/-dev$/, '');
        ppa = 'ppa:deadsnakes/nightly';
    } else {
        ppa = 'ppa:deadsnakes/ppa';
    }

    const py = `python${version}`;

    // TODO: this is specific to bionic, when github actions switches to
    // focal this will need to be updated!
    let packages = [`${py}-dev`, `${py}-venv`];
    if (versionF >= 3.9) {
        packages.push(`${py}-distutils`);
    } else {
        packages.push('python3-distutils');
    }

    await core.group(`set up deadsnakes and install ${py}`, async () => {
        await exec.exec('sudo', ['add-apt-repository', ppa]);
        await exec.exec(
            'sudo',
            [
                'apt-get', 'install', '-y', '--no-install-recommends',
                ...packages,
            ],
        );
    });

    await core.group(`set up ${py} environment`, async () => {
        const envdir = path.join(os.homedir(), `venv-${version}`);
        await exec.exec(py, ['-mvenv', envdir]);
        core.addPath(path.join(envdir, 'bin'));
        const packages = ['pip', 'setuptools', 'wheel'];
        await exec.exec('pip', ['install', '--upgrade', ...packages]);
    });
}

main().catch((e) => core.setFailed(e.message));
