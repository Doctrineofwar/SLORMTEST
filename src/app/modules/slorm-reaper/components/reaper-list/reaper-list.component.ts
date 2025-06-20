import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractUnsubscribeComponent } from '@shared/components/abstract-unsubscribe/abstract-unsubscribe.component';
import { ClipboardService } from '@shared/services/clipboard.service';
import { MessageService } from '@shared/services/message.service';
import { SearchService } from '@shared/services/search.service';
import {
    HeroClass,
    MAX_EFFECT_AFFINITY_BASE,
    MAX_REAPER_AFFINITY_BASE,
    MAX_REAPER_AFFINITY_BONUS,
    MAX_REAPER_LEVEL,
    Reaper,
    SlormancerDataService,
    SlormancerReaperService,
    valueOrDefault,
} from '@slorm-api';
import { toBlob } from 'html-to-image';
import { combineLatest, takeUntil } from 'rxjs';

interface ReaperListForm {
    search: FormControl<string>;
    heroClass: FormControl<HeroClass>;
    primordial: FormControl<boolean>;
    maxLevelAndAffinity: FormControl<boolean>;
    onlyMaxEvolve: FormControl<boolean>;
}

@Component({
  selector: 'app-reaper-list',
  templateUrl: './reaper-list.component.html',
  styleUrls: ['./reaper-list.component.scss']
})
export class ReaperListComponent extends AbstractUnsubscribeComponent implements OnInit {

    public readonly HERO_CLASSES = [HeroClass.Warrior, HeroClass.Huntress, HeroClass.Mage];

    public allReapers: Array<Reaper> = [];

    public filteredReapers: Array<Reaper> = [];

    public heroClass: HeroClass = HeroClass.Huntress;
    public primordial: boolean = false;

    public readonly form = new FormGroup<ReaperListForm>({
        search: new FormControl<string>('', { nonNullable: true }),
        heroClass: new FormControl<HeroClass>(HeroClass.Huntress, { nonNullable: true }),
        primordial: new FormControl<boolean>(false, { nonNullable: true }),
        maxLevelAndAffinity: new FormControl<boolean>(false, { nonNullable: true }),
        onlyMaxEvolve: new FormControl<boolean>(false, { nonNullable: true })
    });

    constructor(private slormancerDataService: SlormancerDataService,
                private searchService: SearchService,
                private slormancerReaperService: SlormancerReaperService,
                private messageService: MessageService,
                private clipboardService: ClipboardService) {
        super();

        this.form.controls.search.valueChanges.subscribe(value => this.searchService.setSearch(value));

        combineLatest([
            this.form.controls.heroClass.valueChanges,
            this.form.controls.primordial.valueChanges,
            this.form.controls.maxLevelAndAffinity.valueChanges,
            this.form.controls.onlyMaxEvolve.valueChanges
        ])
        .subscribe(([heroClass, primordial, maxLevelAndAffinity, onlyMaxEvolve]) => this.buildReaperList(heroClass, primordial, maxLevelAndAffinity, onlyMaxEvolve));

    }

    public ngOnInit() {
        this.form.patchValue({
            search: '',
            heroClass: HeroClass.Huntress,
            primordial: false,
            maxLevelAndAffinity: false,
            onlyMaxEvolve: false
        });
        
        this.searchService.searchChanged
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => this.filterReaperList(this.form.controls.onlyMaxEvolve.value));
    }

    private buildReaperList(heroClass: HeroClass, primordial: boolean, maxLevelAndAffinity: boolean, onlyMaxEvolve: boolean) {
        this.allReapers = this.slormancerDataService.getGameDataAvailableReaper()
            .map(reaperData => this.slormancerReaperService.getReaper(
                reaperData,
                heroClass,
                primordial,
                maxLevelAndAffinity ? valueOrDefault(reaperData.MAX_LVL, 0) : 1,
                0,
                0,
                0,
                maxLevelAndAffinity ? MAX_REAPER_AFFINITY_BASE : 0,
                maxLevelAndAffinity ? (this.slormancerReaperService.useDifferentAffinityForEffects({ id: reaperData.REF, primordial: primordial } as any as Reaper) ? MAX_EFFECT_AFFINITY_BASE : MAX_REAPER_AFFINITY_BASE) : 0,
                maxLevelAndAffinity ? MAX_REAPER_AFFINITY_BONUS : 0,
                maxLevelAndAffinity ? MAX_REAPER_LEVEL : 0));

        this.filterReaperList(onlyMaxEvolve);
    }

    private filterReaperList(onlyMaxEvolve: boolean) {
        this.filteredReapers = this.allReapers
            .filter(reaper => this.searchService.reaperMatchSearch(reaper))
            .filter(reaper => onlyMaxEvolve ? (reaper.evolveInto === null) : true);
    }

    public hasSearch(): boolean {
        return this.searchService.hasSearch();
    }

    public removeSearch() {
        this.form.patchValue({ search: '' });
    }

    public selectClass(heroClass: HeroClass) {
        this.form.patchValue({ heroClass });
    }

    public isSelectedClass(heroClass: HeroClass): boolean {
        const control = this.form.get('heroClass');
        return control !== null && control.value === heroClass;
    }

    public copy(reaperDom: HTMLElement) {
        toBlob(reaperDom).then(
            value => {
                const copySuccess = value !== null && this.clipboardService.copyImageToClipboard(value);

                if (copySuccess) {
                    this.messageService.message('Reaper image copied to clipboard');
                } else {
                    this.messageService.error('Failed to copy reaper image to clipboard');
                }
            },
            () => this.messageService.error('Failed to copy reaper image to clipboard')
        )
    }

    public isNotAvailable(reaper: Reaper): boolean {
        return false;
    }

    public isCopyable(): boolean {
        return this.clipboardService.canCopyImage();
    }
    
        public debug(reaper: Reaper) {
            console.log(reaper);
        }

}
