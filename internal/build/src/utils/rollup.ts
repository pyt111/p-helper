import { getPackageDependencies, phPackage } from '@p-helper/build-utils';
import type { OutputOptions, RollupBuild } from 'rollup';

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(phPackage);

  return (id: string) => {
    const packages: string[] = peerDependencies;
    if (!options.full) {
      packages.push('@vue', '@vueuse', ...dependencies);
    }

    return [...new Set(packages)].some((pkg) => {
      return id === pkg || id.startsWith(`${pkg}/`);
    });
  };
};

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)));
}

export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? '.min' : ''}.${ext}`;
}
