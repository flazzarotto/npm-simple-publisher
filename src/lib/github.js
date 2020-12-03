const githubRegexp = /^https:\/\/github.com\/([^\\]+)\/([^\\]+)$/

// 1 => username, 2 => repo name
export function isGithub(url) {
    return url && (url ?? '').match(githubRegexp)
}

export function generateGithubRemote(parsedGithubRepoHomepage) {
    return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '.git'
}

export function generateGithubIssues(parsedGithubRepoHomepage) {
    return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '/issues'
}

export function generateGithubSshRemote(parsedGithubRepoHomepage) {
    return `git@github.com:${parsedGithubRepoHomepage[1]}/${parsedGithubRepoHomepage[2]}.git`
}
