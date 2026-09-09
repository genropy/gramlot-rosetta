# Repository ownership decision — 2026-09-09

The owner chose to remain under genropy. The remote stays genropy/demo-rosetta;
Gramlot Rosetta is the product name. No separate organization or repository
transfer is planned. The migration below is included in the authorized commit
and push; statements about uncommitted work describe earlier checkpoints.

# Server independence — final package boundary

Updated: 2026-09-09. This supersedes all --no-deps and optional-ASGI packaging
notes retained below. Gramlot has no Genro ASGI dependency or extra. Rosetta
installs the rebuilt wheel normally with dependencies; no genro-asgi appears in
its environment. The FastAPI host remains in Rosetta. The old Gramlot ASGI/WSX
integration is archived in Gramlot for a future separate application repository.

16 backend tests pass after normal installation. All 49 browser tests pass on the rebuilt wheel, including inspector, forms and
repeated panels. The temporary verification server was stopped. No repository rename, commit or push is implied.

## Earlier builder migration record

# GramlotBuilder wheel consumer — latest checkpoint

Updated: 2026-09-09. This supersedes the pinned preview/source setup described below.

Rosetta imports gramlot.builder.GramlotBuilder and gramlot.transport.to_tytx.
Recipes receive builder.root; serialization uses builder.source. JS uses the
GramlotBuilder export from builder.js. The normal environment has no framework
source override and no preview Builders path. Dependency reporting confirms
public genro-builders 0.23.2 (no direct_url origin) and genro_asgi_installed=false.

The new wheel includes all runtime assets. Before publication, setup requires
ROSETTA_GRAMLOT_WHEEL or the retained .local/packages wheel; a new clone cannot
fetch an unpublished artifact. Source development is explicitly selected with
ROSETTA_GRAMLOT_ROOT. The wheel is installed with --no-deps because its current
metadata requires ASGI; requirements.lock supplies the FastAPI author's needed
public dependencies. Optional-host package metadata remains Gramlot work.

16 backend tests and Ruff pass. All 49 browser tests pass on the installed wheel with no source override, including inspector, typed forms and repeated panels. The temporary server was stopped. The
source-based migration report that follows is retained as provenance, not current
setup instructions. Repository/path naming and uncommitted status are unchanged.

## Previous migration checkpoint

# Gramlot Rosetta migration

Date: 2026-09-09. Local implementation; not committed or pushed by this task.

## Active contract

Rosetta is a separate FastAPI consumer. Python recipes import gramlot; JS uses
Gramlot's gramlot-dom module and page modules from js/pages/src. The setup pins
Gramlot dd1aec3a0e53bf2a41741fc5b41ad930f564affe and Builders preview
25ae61950717afae10e1d43d8318f272122202ac. Both are fetched successfully through
the normal dependency setup. No framework code is copied or patched in Rosetta.

The existing /pages/ and /pages-js/ route identifiers and source directory names
are retained so bookmarks and source links stay valid. Visible variant names are
Gramlot Python and Gramlot JS. The application/package is Gramlot Rosetta;
the repository remote and physical checkout retain demo-rosetta pending a separate
repository rename. Old dependency folders are preserved but no longer loaded.

## Verification

- 16 backend tests pass; Ruff passes.
- 49 Chromium browser tests pass against the canonical Gramlot source: all four
  variants, progressive binding examples, local and repeated scopes, source view,
  live JS editing/error recovery, inspector Data edits and memory form validation,
  save/restore and responsive layout.
- The normal setup fetches the pinned Gramlot checkout and installs its JS lockfile.
- Final default-checkout verification: 16 backend tests and all 49 browser tests
  pass without source overrides. Dependency report confirms clean pinned checkouts
  and genro_asgi_installed=false. Temporary test servers were stopped.

This is source-based consumption with the preview dependency exposed. It is not a
clean public-wheel installation, a mobile-device certification or a deployment.
The new GramlotBuilder remains separate framework work; Rosetta currently uses
WidgetTestBuilder/GalleryBuilder supplied by the migrated alpha.

## Continuing development

Use scripts/run.sh and scripts/check.sh. For work against the canonical framework,
set ROSETTA_GRAMLOT_ROOT to its root directory before running both commands.
Use scripts/dependencies.py under scripts/environment.sh to inspect provenance.
The default setup uses its pinned local dependency checkout, not a sibling repo.
Do not treat historical docs describing genro_pages or separate DOM checkouts as
current installation instructions. README.md is the current setup entry point.
