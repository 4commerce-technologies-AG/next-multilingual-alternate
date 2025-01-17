"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripBasePath = exports.getQueryParameters = exports.containsQueryParameters = exports.rewriteToQueryParameters = exports.queryToRewriteParameters = exports.hydrateQueryParameters = exports.getCookieLocale = exports.setCookieLocale = exports.getPreferredLocale = exports.normalizeLocale = exports.isLocale = exports.getActualDefaultLocale = exports.getActualLocales = exports.getActualLocale = exports.highlightFilePath = exports.highlight = exports.log = void 0;
var colorette_1 = require("colorette");
var nextLog = __importStar(require("next/dist/build/output/log"));
var nookies_1 = __importDefault(require("nookies"));
var path_1 = require("path");
var resolve_accept_language_1 = __importDefault(require("resolve-accept-language"));
/**
 * Wrapper in front of Next.js' log to only show messages in non-production environments.
 *
 * To avoid exposing sensitive data (e.g., server paths) to the clients, we only display logs in non-production environments.
 */
var log = /** @class */ (function () {
    function log() {
    }
    /**
     * Log a warning message in the console(s) to non-production environments.
     *
     * @param message - The warning message to log.
     */
    log.warn = function (message) {
        if (process.env.NEXT_PUBLIC_nextMultilingualWarnings && process.env.NODE_ENV !== 'production') {
            nextLog.warn(message);
        }
    };
    return log;
}());
exports.log = log;
/**
 * Highlight a segment of a log message.
 *
 * @param segment - A segment of a log message.
 *
 * @returns The highlighted segment of a log message.
 */
function highlight(segment) {
    return (0, colorette_1.cyanBright)(segment);
}
exports.highlight = highlight;
/**
 * Highlight a file path segment of a log message, normalized with the current file system path separator
 *
 * @param filePath - A file path segment of a log message.
 *
 * @returns The highlighted file path segment of a log message.
 */
function highlightFilePath(filePath) {
    return highlight(path_1.sep !== '/' ? filePath.replace(/\//g, path_1.sep) : filePath);
}
exports.highlightFilePath = highlightFilePath;
/**
 * Get the actual locale based on the current locale from Next.js.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer easily know what is the current locale. This function is meant to return the
 * actual current of locale by replacing the "multilingual" default locale by the actual default locale.
 *
 * @param locale - The current locale from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 * @param locales - The configured i18n locales from Next.js.
 *
 * @returns The list of actual locales.
 */
function getActualLocale(locale, defaultLocale, locales) {
    if (locale === undefined || defaultLocale === undefined || locales === undefined) {
        throw Error('locales must be configured in Next.js');
    }
    var actualDefaultLocale = getActualDefaultLocale(locales, defaultLocale);
    return locale === defaultLocale ? actualDefaultLocale : locale;
}
exports.getActualLocale = getActualLocale;
/**
 * Get the actual locales based on the Next.js i18n locale configuration.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer use `locales`. This function is meant to return the actual list of locale
 * by removing the "multilingual" default locale.
 *
 * @param locales - The configured i18n locales from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 *
 * @returns The list of actual locales.
 */
function getActualLocales(locales, defaultLocale) {
    if (locales === undefined || defaultLocale === undefined) {
        throw Error('locales must be configured in Next.js');
    }
    return locales.filter(function (locale) { return locale !== defaultLocale; });
}
exports.getActualLocales = getActualLocales;
/**
 * Get the actual default locale based on the Next.js i18n locale configuration.
 *
 * To get a dynamic locale resolution on `/` without redirection, we need to add a "multilingual" locale as the
 * default locale so that we can identify when the homepage is requested without a locale. With this setup it
 * also means that we can no longer use `defaultLocale`. This function is meant to return the actual default
 * locale (excluding the "multilingual" default locale). By convention (and for simplicity), the first
 * `actualLocales` will be used as the actual default locale.
 *
 * @param locales - The configured i18n locales from Next.js.
 * @param defaultLocale - The configured i18n default locale from Next.js.
 *
 * @returns The actual default locale.
 */
function getActualDefaultLocale(locales, defaultLocale) {
    var _a;
    if (locales === undefined || defaultLocale === undefined) {
        throw Error('locales must be configured in Next.js');
    }
    return (_a = getActualLocales(locales, defaultLocale)) === null || _a === void 0 ? void 0 : _a.shift();
}
exports.getActualDefaultLocale = getActualDefaultLocale;
/**
 * Is a given string a locale identifier following the `language`-`country` format?
 *
 * @param locale - A locale identifier.
 * @param checkNormalizedCase - Test is the provided locale follows the ISO 3166 case convention (language code lowercase, country code uppercase).
 *
 * @returns `true` if the string is a locale identifier following the `language`-`country`, otherwise `false`.
 */
function isLocale(locale, checkNormalizedCase) {
    if (checkNormalizedCase === void 0) { checkNormalizedCase = false; }
    var regexp = new RegExp(/^[a-z]{2}-[A-Z]{2}$/, !checkNormalizedCase ? 'i' : '');
    return regexp.test(locale);
}
exports.isLocale = isLocale;
/**
 * Get a normalized locale identifier.
 *
 * `next-multilingual-alternate` only uses locale identifiers following the `language`-`country` format. Locale identifiers
 * are case insensitive and can be lowercase, however it is recommended by ISO 3166 convention that language codes
 * are lowercase and country codes are uppercase.
 *
 * @param locale - A locale identifier.
 *
 * @returns The normalized locale identifier following the ISO 3166 convention.
 */
function normalizeLocale(locale) {
    if (!isLocale(locale)) {
        return locale;
    }
    var _a = locale.split('-'), languageCode = _a[0], countryCode = _a[1];
    return "".concat(languageCode.toLowerCase(), "-").concat(countryCode.toUpperCase());
}
exports.normalizeLocale = normalizeLocale;
/**
 * Resolve the preferred locale from an HTTP `Accept-Language` header.
 *
 * @param acceptLanguageHeader - The value of an HTTP request `Accept-Language` header.
 * @param actualLocales - The list of actual locales used by `next-multilingual-alternate`.
 * @param actualDefaultLocale - The actual default locale used by `next-multilingual-alternate`.
 *
 * @returns The preferred locale identifier.
 */
function getPreferredLocale(acceptLanguageHeader, actualLocales, actualDefaultLocale) {
    if (acceptLanguageHeader === undefined) {
        return actualDefaultLocale;
    }
    return (0, resolve_accept_language_1.default)(acceptLanguageHeader, actualLocales, actualDefaultLocale);
}
exports.getPreferredLocale = getPreferredLocale;
// The name of the cookie used to store the user locale, can be overwritten in an `.env` file.
var LOCALE_COOKIE_NAME = process.env.NEXT_PUBLIC_LOCALE_COOKIE_NAME
    ? process.env.NEXT_PUBLIC_LOCALE_COOKIE_NAME
    : 'L';
// The lifetime of the cookie used to store the user locale, can be overwritten in an `.env` file.
var LOCALE_COOKIE_LIFETIME = process.env.NEXT_PUBLIC_LOCALE_COOKIE_LIFETIME !== undefined
    ? +process.env.NEXT_PUBLIC_LOCALE_COOKIE_LIFETIME
    : 60 * 60 * 24 * 365 * 10;
/**
 * Save the current user's locale to the locale cookie.
 *
 * @param locale - A locale identifier.
 */
function setCookieLocale(locale) {
    if (locale === undefined) {
        throw Error('locales must be configured in Next.js');
    }
    nookies_1.default.set(null, LOCALE_COOKIE_NAME, locale, __assign(__assign({}, ((LOCALE_COOKIE_LIFETIME !== -1) ? { maxAge: LOCALE_COOKIE_LIFETIME } : null)), { path: '/', sameSite: 'lax' }));
}
exports.setCookieLocale = setCookieLocale;
/**
 * Get the locale that was saved to the locale cookie.
 *
 * @param serverSidePropsContext - The Next.js server side properties context.
 * @param actualLocales - The list of actual locales used by `next-multilingual-alternate`.
 *
 * @returns The locale that was saved to the locale cookie.
 */
function getCookieLocale(serverSidePropsContext, actualLocales) {
    var cookies = nookies_1.default.get(serverSidePropsContext);
    if (!Object.keys(cookies).includes(LOCALE_COOKIE_NAME)) {
        return undefined;
    }
    var cookieLocale = cookies[LOCALE_COOKIE_NAME];
    if (!actualLocales.includes(cookieLocale)) {
        // Delete the cookie if the value is invalid (e.g., been tampered with).
        nookies_1.default.destroy(serverSidePropsContext, LOCALE_COOKIE_NAME);
        return undefined;
    }
    return cookieLocale;
}
exports.getCookieLocale = getCookieLocale;
/**
 * Hydrate a path back with its query values.
 *
 * Missing query parameters will show warning messages and will be kept in their original format.
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 *
 * @param path - A path containing "query parameters".
 * @param parsedUrlQueryInput - A `ParsedUrlQueryInput` object containing router queries.
 * @param suppressWarning - If set to true, will not display a warning message if the key is missing.
 *
 * @returns The hydrated path containing `query` values instead of placeholders.
 */
function hydrateQueryParameters(path, parsedUrlQueryInput, suppressWarning) {
    if (suppressWarning === void 0) { suppressWarning = false; }
    var pathSegments = path.split('/');
    var missingParameters = [];
    var hydratedPath = pathSegments
        .map(function (pathSegment) {
        if (/^\[.+\]$/.test(pathSegment)) {
            var parameterName = pathSegment.slice(1, -1);
            if (parsedUrlQueryInput[parameterName] !== undefined) {
                return parsedUrlQueryInput[parameterName];
            }
            else {
                missingParameters.push(parameterName);
            }
        }
        return pathSegment;
    })
        .join('/');
    if (missingParameters.length && !suppressWarning) {
        log.warn("unable to hydrate the path ".concat(highlight(path), " because the following query parameter").concat(missingParameters.length > 1 ? 's are' : ' is', " missing: ").concat(highlight(missingParameters.join(',')), "."));
    }
    return hydratedPath;
}
exports.hydrateQueryParameters = hydrateQueryParameters;
/**
 * Convert a path using "query parameters" to "rewrite parameters".
 *
 * Next.js' router uses the bracket format (e.g., `/[example]`) to identify dynamic routes, called "query parameters". The
 * rewrite statements use the colon format (e.g., `/:example`), called "rewrite parameters".
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * @param path - A path containing "query parameters".
 *
 * @returns The path converted to the "rewrite parameters" format.
 */
function queryToRewriteParameters(path) {
    return path
        .split('/')
        .map(function (pathSegment) {
        if (/^\[.+\]$/.test(pathSegment)) {
            return ":".concat(pathSegment.slice(1, -1));
        }
        return pathSegment;
    })
        .join('/');
}
exports.queryToRewriteParameters = queryToRewriteParameters;
/**
 * Convert a path using "rewrite parameters" to "query parameters".
 *
 * Next.js' router uses the bracket format (e.g., `/[example]`) to identify dynamic routes, called "query parameters". The
 * rewrite statements use the colon format (e.g., `/:example`), called "rewrite parameters".
 *
 * @see https://nextjs.org/docs/routing/dynamic-routes
 * @see https://nextjs.org/docs/api-reference/next.config.js/rewrites
 *
 * @param path - A path containing "rewrite parameters".
 *
 * @returns The path converted to the "router queries" format.
 */
function rewriteToQueryParameters(path) {
    return path
        .split('/')
        .map(function (pathSegment) {
        if (pathSegment.startsWith(':')) {
            return "[".concat(pathSegment.slice(1), "]");
        }
        return pathSegment;
    })
        .join('/');
}
exports.rewriteToQueryParameters = rewriteToQueryParameters;
/**
 * Does a given path contain "query parameters" (using the bracket syntax)?
 *
 * @param path - A path containing "query parameters".
 *
 * @returns True if the path contains "query parameters", otherwise false.
 */
function containsQueryParameters(path) {
    return path.split('/').find(function (pathSegment) { return /^\[.+\]$/.test(pathSegment); }) === undefined
        ? false
        : true;
}
exports.containsQueryParameters = containsQueryParameters;
/**
 * Get "query parameters" (using the bracket syntax) from a path.
 *
 * @param path - A path containing "query parameters".
 *
 * @returns An array of "query parameters" or an empty array when not found.
 */
function getQueryParameters(path) {
    var parameters = path.split('/').filter(function (pathSegment) { return /^\[.+\]$/.test(pathSegment); });
    if (parameters === undefined) {
        return [];
    }
    return parameters.map(function (parameter) { return parameter.slice(1, -1); });
}
exports.getQueryParameters = getQueryParameters;
/**
 * Strips the base path from a URL if present.
 *
 * @param url - The URL from which to strip the base path.
 * @param basePath - The base path to strip.
 *
 * @returns The URL without the base path if present.
 */
function stripBasePath(url, basePath) {
    if (url.startsWith(basePath)) {
        return url.replace(basePath, '');
    }
    return url;
}
exports.stripBasePath = stripBasePath;
